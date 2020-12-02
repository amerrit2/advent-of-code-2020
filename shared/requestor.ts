import { request } from "https";

const urlBase = `https://adventofcode.com/2020/day/{day}/input`;

// I need auth!

export async function fetchInput(day: number) {
  const url = urlBase.replace(`\{day\}`, `${day}`);
  console.log("url: ", url);

  return new Promise<void>((a, r) => {
    request(
      url,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36",
          Accept: "Accept: text/html",
          Cookie:
            "session=53616c7465645f5f6b0f7381f95350436713c84145536deb22ea3c4ee70404f717c89644453040f5a32a3b4be2a94965",
        },
      },
      (res) => {
        debugger;
        res.on("error", (e) => {
          r(e);
        });

        res.on("data", () => {
          console.log("Here's some data!!");
          debugger;
          a();
        });
      }
    );
  });
}

fetchInput(1).catch((e) => console.error(e));
