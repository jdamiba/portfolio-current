import { useRef } from "react";
import Header from "../components/Header";
import Socials from "../components/Socials";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";

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
    <div className={`relative`}>
      <Head>
        <title>Joseph Damiba</title>
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
              Hello! I am Joseph Damiba, a full-stack software engineer with six
              years of experience.
            </h1>
          </div>

          <Socials className="mt-2 laptop:mt-5" />
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-2xl text-bold">Portfolio.</h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link">
              <h1 className="mt-5 text-3xl font-medium">EmbedEval</h1>
              <h2 className="text-xl opacity-50">
                An AI devtool to help developers find the best text embedding
                model for their RAG chatbot. Built with Next.js, Qdrant, and
                Langchain.
              </h2>
              <h3 className="text-xl opacity-50">
                <a
                  href="https://github.com/AmoebaLabsAI/embedeval"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Code
                </a>
              </h3>
            </div>
            <div className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link">
              <h1 className="mt-5 text-3xl font-medium">PhotoGen</h1>
              <h2 className="text-xl opacity-50">
                An AI photo generation Software-as-a-Service web application
                that lets users create an AI model of themselves and take
                pictures. Built using Next.js, Postgres, Replicate, Clerk, and
                Stripe.
              </h2>
              <h3 className="text-xl opacity-50">
                <a
                  href="https://github.com/AmoebaLabsAI/photogen"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Code
                </a>
              </h3>
            </div>

            <div className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link">
              <h1 className="mt-5 text-3xl font-medium">Twitter Clone</h1>
              <h2 className="text-xl opacity-50">
                A text-based social network where users can write posts and
                follow other users. Built using Next.js, Tailwind CSS, and
                Postgres.
              </h2>
              <h3 className="text-xl opacity-50">
                <a
                  href="https://github.com/jdamiba/twitter-clone"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Code
                </a>
              </h3>
            </div>

            <div className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link">
              <h1 className="mt-5 text-3xl font-medium">Pokemon API</h1>
              <h2 className="text-xl opacity-50">
                An API server that serves information about Pokemon. Features
                user authentication (signup, login), authorization with
                role-based access control (admin, user), token-based
                authentication using JWT (JSON Web Tokens), and secure password
                handling with hashing. Built with Node.js and MongoDB.
              </h2>
              <h3 className="text-xl opacity-50">
                <a
                  href="https://github.com/jdamiba/pokedex-api"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Code
                </a>
              </h3>
            </div>

            <div className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link">
              <h1 className="mt-5 text-3xl font-medium">The Pulse</h1>
              <h2 className="text-xl opacity-50">
                A website that parses chat messages during Twitch and YouTube
                livestreams and creates data visualizations for an OBS overlay.
                Built using Next.js, Postgres, and Amazon EC2.
              </h2>
              <h3 className="text-xl opacity-50">
                <a
                  href="https://github.com/AmoebaLabsAI/the-pulse-votes-overlay"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Code
                </a>
              </h3>
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
            Joseph Damiba is a full-stack software engineer, bringing with him a
            unique blend of technical expertise and communication skills. Joseph
            has a strong foundation in full-stack software engineering in
            JavaScript/TypeScript as a result of 6 years spent as a front-end
            web developer for startups in the software, consulting, and video
            gaming industries. His communication skills were developed as a
            public speaker in high school and college, where he participated in
            policy and parliamentary debating, culminating in a role as the
            Parliamentary Debate Coach at Cornell University, a position he held
            while earning a a Master&apos;s in Industrial and Labor Relations at
            the university. This prestigious degree enhances his understanding
            of organizational dynamics and communication strategies, crucial
            skills for effectively advocating for developers and fostering
            strong relationships between tech companies and their developer
            communities. With his technical acumen, communication skills, and
            interdisciplinary education, Joseph is poised to excel in his new
            role, driving engagement and innovation in the tech ecosystem.
          </p>
        </div>

        <div className="mt-10 w-full flex flex-col">
          <div className={`w-full max-w-4xl rounded-lg shadow-sm`}>
            <h1 className="text-3xl font-bold" id="resume-start">
              Resume
            </h1>
            <h2 className="text-xl mt-5">
              I&apos;m a full-stack software engineer.
            </h2>
            <h2 className="w-4/5 text-xl mt-5 opacity-50">
              Architecting and implementing full-stack, distributed systems
            </h2>
            <div className="mt-2">
              <Socials />
            </div>
            <div className="mt-5">
              <h1 className="text-2xl font-bold">Experience</h1>

              <div className="mt-5 w-full flex mob:flex-col desktop:flex-row justify-between">
                <div className="text-lg w-2/5">
                  <h2>July 2024 - Present</h2>
                  <h3 className="text-sm opacity-50">Part-time</h3>
                </div>
                <div className="w-3/5">
                  <h2 className="text-lg font-bold">
                    Lead Full-stack Software Engineer at The Pulse
                  </h2>
                  <ul className="list-disc">
                    <li className="text-sm my-1 opacity-70">
                      Designed and implemented a full-stack distributed system
                      using Amazon EC2, Node.js, Vercel, Next.js, and Postgres
                      that ingests chat messages written by viewers of YouTube
                      and Twitch livestreams, parses them, and creates an
                      interactive data visualization used as an overlay in OBS
                      for a YouTuber with over 3 million subscribers
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
                  Master&apos;s, Industrial and Labor Relations
                </p>
              </div>
              <div className="mt-2">
                <h2 className="text-lg">Rochester Institute of Technology</h2>
                <p className="text-sm mt-2 opacity-50">
                  Bachelor&apos;s of Science, Applied Arts and Sciences
                </p>
              </div>
            </div>
            <div className="mt-5">
              <h1 className="text-2xl font-bold">Skills</h1>
              <div className="flex mob:flex-col desktop:flex-row justify-between">
                <div className="mt-2 mob:mt-5">
                  <h2 className="text-lg">Languages</h2>
                  <ul className="list-disc">
                    <li className="ml-5 py-2">JavaScript</li>
                  </ul>
                </div>
                <div className="mt-2 mob:mt-5">
                  <h2 className="text-lg">Frameworks</h2>
                  <ul className="list-disc">
                    <li className="ml-5 py-2">React</li>
                  </ul>
                </div>
                <div className="mt-2 mob:mt-5">
                  <h2 className="text-lg">Others</h2>
                  <ul className="list-disc">
                    <li className="ml-5 py-2">Git</li>
                    <li className="ml-5 py-2">Postgres</li>
                    <li className="ml-5 py-2">AWS EC2</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
