import { useRef } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
import { resume } from "../data/portfolio.json";
import { name, showResume } from "../data/portfolio.json";

// Local Data
import data from "../data/portfolio.json";

export default function Home() {
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThree.current, textFour.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        <div className="laptop:mt-20 mt-10">
          <div className="mt-5">
            <h1
              ref={textOne}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
            >
              {data.headerTaglineOne}
            </h1>
            <h1
              ref={textTwo}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineTwo}
            </h1>
            <h1
              ref={textThree}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineThree}
            </h1>
            <h1
              ref={textFour}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {data.headerTaglineFour}
            </h1>
          </div>

          <Socials className="mt-2 laptop:mt-5" />
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-2xl text-bold">Work.</h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            <div
              className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link"
              onClick={() => window.open("https://www.embedeval.com")}
            >
              <div
                className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 h-48 mob:h-auto"
                style={{ height: "600px" }}
              >
                <img
                  alt={"A screenshot of the EmbedEval homepage"}
                  className="h-[600px] w-[100%] object-fit hover:scale-110 transition-all ease-out duration-300"
                  src={"/images/embedeval.png"}
                ></img>
              </div>
              <h1 className="mt-5 text-3xl font-medium">EmbedEval</h1>
              <h2 className="text-xl opacity-50">
                An AI devtool to help developers find the best text embedding
                model for their RAG chatbot.
              </h2>
            </div>
            <div
              className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link"
              onClick={() => window.open("https://www.embedeval.com")}
            >
              <div
                className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 h-48 mob:h-auto"
                style={{ height: "600px" }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/yGZ_L1uLa5g?si=BhXS--t68I4G6XUD"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h1 className="mt-5 text-3xl font-medium">
                What It`&apos;s Like To Find Out About LangChain
              </h1>
              <h2 className="text-xl opacity-50">
                A YouTube video showing people how to use LangChain to build
                applications with LLMs.
              </h2>
            </div>
          </div>
        </div>
        <div className="mt-10 laptop:mt-40" ref={aboutRef}>
          <h1 className="tablet:m-10 text-2xl text-bold">About.</h1>
          <p className="tablet:m-10 mt-2 text-xl laptop:text-3xl w-full">
            {data.aboutpara}
          </p>
        </div>

        <div className="mt-10 w-full flex flex-col">
          <div className={`w-full max-w-4xl rounded-lg shadow-sm`}>
            <h1 className="text-3xl font-bold" id="resume-start">
              {name} Resume
            </h1>
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
                        onClick={() => window.open("https://www.embedeval.com")}
                      >
                        <a href="https:://www.embedeval.com">EmbedEval.com</a>
                      </span>
                      - a web application that uses LangChain and Next.js to
                      allow developers to compare and contrast the performance
                      of text embedding models on their own data in the context
                      of retrieval augmented generation
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
                      Designed and developed a Next.js application which served
                      Artie&apos;s marketing website to 100,000+ unique monthly
                      visitors and its flagship video game, Pong Legends, to
                      1000+f monthly active players
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
                      Led 35+ client-facing status update meetings on a project
                      to create a React.js-based reference front-end for a
                      healthcare startup with over $3 billion valuation
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
                      Contributed to the full lifecycle of software development
                      for Dash, Plotly&apos;s open-source Python data
                      visualization software which is installed over 3,000,000
                      times each month. Most notably, designed and developed the
                      Dash For Julia documentation
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
                  Master`&apos;s, Industrial and Labor Relations
                </p>
              </div>
              <div className="mt-2">
                <h2 className="text-lg">Rochester Institute of Technology</h2>
                <p className="text-sm mt-2 opacity-50">
                  Bachelor`&apos;s of Science, Applied Arts and Sciences
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

        <Footer />
      </div>
    </div>
  );
}
