"""Fetch contribution calendar and public repos, write data/github.json.

Run locally with `GH_TOKEN=$(gh auth token) python scripts/fetch_github.py`,
or let .github/workflows/refresh-data.yml run it daily.

The token matters: a personal token with `read:user` returns private
contributions in the calendar total, which is where most of the work lives.
The default Actions token only sees public activity.
"""

import json
import os
import pathlib
import re
import sys
import urllib.error
import urllib.request

USER = os.environ.get("GH_USER", "MR-Axel")
TOKEN = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "github.json"

QUERY = """
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
    repositories(first: 100, privacy: PUBLIC, isFork: false,
                 orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        name description url stargazerCount pushedAt isArchived
        primaryLanguage { name }
        repositoryTopics(first: 10) { nodes { topic { name } } }
      }
    }
  }
}
"""


def graphql():
    if not TOKEN:
        sys.exit("no GH_TOKEN / GITHUB_TOKEN in the environment")
    body = json.dumps({"query": QUERY, "variables": {"login": USER}}).encode()
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=body,
        headers={
            "Authorization": "bearer " + TOKEN,
            "Content-Type": "application/json",
            "User-Agent": USER + "-site",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        payload = json.load(resp)
    if "errors" in payload:
        sys.exit("GitHub API error: " + json.dumps(payload["errors"]))
    return payload["data"]["user"]



def main():
    user = graphql()
    calendar = user["contributionsCollection"]["contributionCalendar"]
    days = [d for week in calendar["weeks"] for d in week["contributionDays"]]

    data = {
        "generated": days[-1]["date"] if days else None,
        "contributions": {
            "total": calendar["totalContributions"],
            "days": [{"d": d["date"], "c": d["contributionCount"]} for d in days],
        },
        "repos": [
            {
                "name": r["name"],
                "description": r["description"],
                "url": r["url"],
                "language": (r["primaryLanguage"] or {}).get("name"),
                "stars": r["stargazerCount"],
                # pushedAt, not updatedAt: editing a description should not
                # make a 2020 repo look like this week's work
                "updated": r["pushedAt"],
                "archived": r["isArchived"],
                "topics": [t["topic"]["name"] for t in r["repositoryTopics"]["nodes"]],
            }
            for r in user["repositories"]["nodes"]
        ],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=1) + "\n", encoding="utf-8")
    print("wrote %s: %d days, %d contributions, %d repos"
          % (OUT.name, len(days), data["contributions"]["total"], len(data["repos"])))



if __name__ == "__main__":
    try:
        main()
    except urllib.error.HTTPError as exc:
        sys.exit("HTTP %s from the GitHub API" % exc.code)
