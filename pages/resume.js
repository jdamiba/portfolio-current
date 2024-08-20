import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import ProjectResume from "../components/ProjectResume";
import Socials from "../components/Socials";
import Button from "../components/Button";
import { useTheme } from "next-themes";
// Data
import { name, showResume } from "../data/portfolio.json";
import { resume } from "../data/portfolio.json";
import data from "../data/portfolio.json";

const Resume = () => {
  const router = useRouter();
  const theme = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
    if (!showResume) {
      router.push("/");
    }
  }, []);
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => router.push("/edit")} type={"primary"}>
            Edit Resume
          </Button>
        </div>
      )}
      {data.showCursor && <Cursor />}
      <div
        className={`container mx-auto mb-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog />
        {mount && (
          <div className="mt-10 w-full flex flex-col items-center">
            <div
              className={`w-full ${
                mount && theme.theme === "dark" ? "bg-slate-800" : "bg-gray-50"
              } max-w-4xl p-20 mob:p-5 desktop:p-20 rounded-lg shadow-sm`}
            >
              <h1 className="text-3xl font-bold">{name}</h1>
              <h2 className="text-xl mt-5">{resume.tagline}</h2>
              <h2 className="w-4/5 text-xl mt-5 opacity-50">
                {resume.description}
              </h2>
              <div className="mt-2">
                <Socials />
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Experience</h1>

                <div className="mt-5 w-full flex mob:flex-col desktop:flex-row justify-between">
                  <div className="text-lg w-2/5">
                    <h2>July 2024 - Present</h2>
                    <h3 className="text-sm opacity-50">Side Project</h3>
                  </div>
                  <div className="w-3/5">
                    <h2 className="text-lg font-bold">
                      Cofounder & CTO at AmoebaLabsAI
                    </h2>
                    <ul className="list-disc">
                      <li className="text-sm my-1 opacity-70">
                        Designed and developed{" "}
                        <span
                          className="underline"
                          onClick={() =>
                            window.open("https://www.embedeval.com")
                          }
                        >
                          <a href="https:://www.embedeval.com">EmbedEval.com</a>
                        </span>
                        - a web application that uses LangChain and Next.js to
                        allow developers to compare and contrast the performance
                        of text embedding models on their own data in the
                        context of retrieval augmented generation
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 w-full flex mob:flex-col desktop:flex-row justify-between">
                  <div className="text-lg w-2/5">
                    <h2>September 2022 - January 2024</h2>
                    <h3 className="text-sm opacity-50">Full-time, remote</h3>
                  </div>
                  <div className="w-3/5">
                    <h2 className="text-lg font-bold">
                      Senior Front-end Developer at Artie
                    </h2>
                    <ul className="list-disc">
                      <li className="text-sm my-1 opacity-70">
                        Designed and developed a Next.js application which
                        served Artie&apos;s marketing website to 100,000+ unique
                        monthly visitors and its flagship video game, Pong
                        Legends, to 1000+f monthly active players
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-5 w-full flex mob:flex-col desktop:flex-row justify-between">
                  <div className="text-lg w-2/5">
                    <h2>August 2021 - August 2022</h2>
                    <h3 className="text-sm opacity-50">Full-time, remote</h3>
                  </div>
                  <div className="w-3/5">
                    <h2 className="text-lg font-bold">
                      Full-stack Software Engineer at Fluxon
                    </h2>
                    <ul className="list-disc">
                      <li className="text-sm my-1 opacity-70">
                        Led feature development for a food delivery startup,
                        working with a cross-functional team to ship a fullstack
                        web application using Next.js and Google Firebase
                      </li>
                      <li className="text-sm my-1 opacity-70">
                        Led 35+ client-facing status update meetings on a
                        project to create a React.js-based reference front-end
                        for a healthcare startup with over $3 billion valuation
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-5 w-full flex mob:flex-col desktop:flex-row justify-between">
                  <div className="text-lg w-2/5">
                    <h2>August 2018 - May 2021</h2>
                    <h3 className="text-sm opacity-50">Full-time, remote</h3>
                  </div>
                  <div className="w-3/5">
                    <h2 className="text-lg font-bold">
                      Dash Core Developer at Plotly
                    </h2>
                    <ul className="list-disc">
                      <li className="text-sm my-1 opacity-70">
                        Contributed to the full lifecycle of software
                        development for Dash, Plotly&apos;s open-source Python
                        data visualization software which is installed over
                        3,000,000 times each month. Most notably, designed and
                        developed the Dash For Julia documentation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h1 className="text-2xl font-bold">Education</h1>
                <div className="mt-2">
                  <h2 className="text-lg">Cornell University</h2>
                  <p className="text-sm mt-2 opacity-50">
                    Master's, Industrial and Labor Relations
                  </p>
                </div>
                <div className="mt-2">
                  <h2 className="text-lg">Rochester Institute of Technology</h2>
                  <p className="text-sm mt-2 opacity-50">
                    Bachelor's of Science, Applied Arts and Sciences
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Skills</h1>
                <div className="flex mob:flex-col desktop:flex-row justify-between">
                  {resume.languages && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Languages</h2>
                      <ul className="list-disc">
                        {resume.languages.map((language, index) => (
                          <li key={index} className="ml-5 py-2">
                            {language}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.frameworks && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Frameworks</h2>
                      <ul className="list-disc">
                        {resume.frameworks.map((framework, index) => (
                          <li key={index} className="ml-5 py-2">
                            {framework}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resume.others && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Others</h2>
                      <ul className="list-disc">
                        {resume.others.map((other, index) => (
                          <li key={index} className="ml-5 py-2">
                            {other}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Resume;
