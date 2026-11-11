// app/api/integrations/verify/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { serviceId, values } = await req.json();

    if (!serviceId || !values) {
      return NextResponse.json(
        { success: false, error: "Missing service ID or credentials." },
        { status: 400 }
      );
    }

    if (serviceId === "github") {
      const token = values.token?.trim();
      if (!token) {
        return NextResponse.json(
          { success: false, error: "Please enter your GitHub Personal Access Token." },
          { status: 400 }
        );
      }

      try {
        const ghRes = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "ResolvAI-Escrow-Verification",
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!ghRes.ok) {
          return NextResponse.json(
            {
              success: false,
              error: `GitHub rejected token (${ghRes.status} ${ghRes.statusText}). Check that the token is valid and not expired.`,
            },
            { status: 400 }
          );
        }

        const ghData = await ghRes.json();
        return NextResponse.json({
          success: true,
          connectedAs: `@${ghData.login}`,
        });
      } catch (err) {
        return NextResponse.json(
          { success: false, error: "Failed to connect to GitHub API. Check your internet connection." },
          { status: 500 }
        );
      }
    }

    if (serviceId === "figma") {
      const token = values.token?.trim();
      if (!token) {
        return NextResponse.json(
          { success: false, error: "Please enter your Figma Personal Access Token." },
          { status: 400 }
        );
      }

      try {
        const figmaRes = await fetch("https://api.figma.com/v1/me", {
          headers: {
            "X-Figma-Token": token,
          },
        });

        if (!figmaRes.ok) {
          return NextResponse.json(
            {
              success: false,
              error: `Figma rejected token (${figmaRes.status} ${figmaRes.statusText}). Check your token in Figma Settings.`,
            },
            { status: 400 }
          );
        }

        const figmaData = await figmaRes.json();
        return NextResponse.json({
          success: true,
          connectedAs: figmaData.handle || figmaData.email || "Figma User",
        });
      } catch (err) {
        return NextResponse.json(
          { success: false, error: "Failed to connect to Figma API. Check your internet connection." },
          { status: 500 }
        );
      }
    }

    if (serviceId === "vercel") {
      const token = values.token?.trim();
      if (!token) {
        return NextResponse.json(
          { success: false, error: "Please enter your Vercel Access Token." },
          { status: 400 }
        );
      }

      try {
        const vclRes = await fetch("https://api.vercel.com/v2/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!vclRes.ok) {
          return NextResponse.json(
            {
              success: false,
              error: `Vercel rejected token (${vclRes.status} ${vclRes.statusText}). Check your token in Vercel Account Settings.`,
            },
            { status: 400 }
          );
        }

        const vclData = await vclRes.json();
        return NextResponse.json({
          success: true,
          connectedAs: vclData.user?.username || vclData.user?.email || "Vercel Account",
        });
      } catch (err) {
        return NextResponse.json(
          { success: false, error: "Failed to connect to Vercel API. Check your internet connection." },
          { status: 500 }
        );
      }
    }

    if (serviceId === "notifications") {
      const email = values.email?.trim();
      const phone = values.phone?.trim();

      if (!email || !email.includes("@") || !email.includes(".")) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid email address." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        connectedAs: phone ? `${email} • ${phone}` : email,
      });
    }

    return NextResponse.json(
      { success: false, error: "Unknown integration service." },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Unexpected verification error." },
      { status: 500 }
    );
  }
}

