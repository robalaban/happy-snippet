import { Router, Request, Response, NextFunction } from "express";
import isAuthenticated from '../middlewares/auth'

const route = Router()

export default async (app: Router) => {
  app.use(["/snippet", "snippets"], route)


  // Gets all gists from Github
  route.get("/", isAuthenticated, async (req: Request, res) => {
    const { accessToken } = req.currentUser;
    const gists = await request("GET /gists/:gist_id", {
      headers: {
        authorization: `token ${accessToken}`,
      },
    });

    res.send({ gists: gists.data });
  });

  // Gets a specific snippet from Github
  route.get("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { githubAccessToken } = req.user;
    const gists = await request("GET /gists/:gist_id", {
      headers: {
        authorization: `token ${githubAccessToken}`,
      },
      gist_id: id,
    });

    res.send({ gists: gists.data });
  });

  // Create a gist and post it to Github
  route.post("/snippets", isAuthenticated, async (req, res) => {
    // TODO: grab the data from there parse it prepare it in the right format send it to Github
    const { githubAccessToken } = req.user;
    let snippet;
    try {
      snippet = await request("POST /gists", {
        headers: {
          authorization: `token ${githubAccessToken}`,
          accept: "application/vnd.github.v3+json",
        },
        data: {
          description: "Testing Gist API",
          files: {
            "Sample.md": {
              content: "# This is a header 1 tag",
            },
            "Another.md": {
              content: "### This is another file in header 3",
            },
          },
        },
      });
    } catch (error) {
      snippet = error;
    }
    res.send({ status: snippet.data }).status(snippet.status);
  });
}
