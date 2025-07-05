"use client";
import { useCommon } from "@/context/CommonContext";
import Layout from "./layout/index";
import Link from "next/link";
import {
  PhoneCall,
  IndianRupee,
  Clock3,
  LayoutGrid,
  ListOrdered,
  AlarmClockCheck,
  CalendarClock,
  Ticket,
  LogIn,
  Wallet,
  Dice5,
  ChevronDown,
  Mail,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

// 🎰 Hero
const Hero = () => (
  <section className="relative bg-gradient-to-br from-black via-red-950 to-black text-yellow-400 py-24 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 relative z-10">
      {/* Left: Text */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide drop-shadow-lg">
          Welcome to Matka Casino
        </h1>
        <p className="text-sm">
          At Matka Casino, we believe in making traditional Matka more exciting,
          accessible, and rewarding. Whether you're a seasoned player or just
          getting started, our user-friendly interface, flexible deposit
          options, and smart betting system ensure everyone can play
          confidently.
        </p>
        <p className="text-lg text-yellow-300">Call Us To Play Now</p>
        <a
          href="tel:+910000000000"
          className="inline-flex items-center bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-yellow-400 transition"
        >
          <PhoneCall className="mr-2" size={18} /> +91 0000000000
        </a>

        <div className="mt-4 flex items-center gap-3">
          <a
            href="https://t.me/" // replace with your actual Telegram link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-400 transition shadow"
          >
            <Send className="mr-2" size={16} /> Follow us on Telegram
          </a>
          <span className="text-sm text-yellow-300">
            for latest updates & offers
          </span>
        </div>
      </div>
    </div>

    {/* Right: Absolute Full Height Image */}
    <div className="hidden md:block absolute top-0 right-0 h-full w-1/2 z-0">
      <img
        src="/images/casino-spinner.jpg"
        alt="Casino Play"
        className="w-full h-full object-cover opacity-30"
      />
    </div>
  </section>
);

// 💸 Rate Card
const RateCard = ({ title, payout }: { title: string; payout: string }) => (
  <div className="flex justify-between items-center bg-gradient-to-r from-yellow-600 to-yellow-800 text-black px-4 py-3 rounded-lg mb-4 shadow hover:shadow-yellow-400 transition">
    <span className="font-bold tracking-wide uppercase">{title}</span>
    <span className="flex items-center gap-1 text-sm">
      <IndianRupee size={16} /> {payout}
    </span>
  </div>
);

// 🎯 Rates Section
const Rates = () => {
  const { matkas } = useCommon();
  return (
    <section className="py-12 bg-black text-center px-4 text-white" id="rates">
      <h2 className="text-2xl font-bold mb-2 text-yellow-400 drop-shadow">
        🎯 Payout Rates
      </h2>
      <p className="text-gray-400 mb-6 text-sm">
        Play big. Win bigger. These are your odds.
      </p>
      <div className="max-w-lg mx-auto text-left">
        {matkas.map((matka) => (
          <Link href={"/b/" + matka._id} key={matka._id}>
            <RateCard
              title={matka.betName}
              payout={`10 ka ${10 * matka.dealType}`}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

// 🧾 Matka Results
interface MatkaResult {
  timeFrom: string;
  timeTo: string;
  title: string;
  open: string;
  jodi: string;
  close: string;
}
const results: MatkaResult[] = [
  {
    timeFrom: "10:00 am",
    timeTo: "11:00 am",
    title: "SRIDEVI MORNING",
    open: "460",
    jodi: "03",
    close: "120",
  },
  {
    timeFrom: "10:30 am",
    timeTo: "11:30 am",
    title: "MILAN MORNING",
    open: "899",
    jodi: "66",
    close: "150",
  },
];

const MatkaResults = () => {
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinnings = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/winning/last`
        );
        setWinnings(res.data);
      } catch (err) {
        console.error("Failed to fetch winnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWinnings();
  }, []);
  return (
    <section
      className="py-12 bg-gradient-to-b from-black via-red-900 to-black px-4 text-white"
      id="matka-results"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-yellow-300 border-b-2 inline-block border-yellow-500 pb-1">
          🎉 Daily Matka Results
        </h3>
      </div>
      <div className="max-w-4xl mx-auto space-y-5 px-4">
        {winnings.map((item: any, index) => {
          const time = new Date(item?.matkaId?.timeTable!).toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          );
          const time1 = new Date(item.date!).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return (
            <div
              key={index}
              className="bg-gradient-to-br from-[#0f0f0f] via-black to-gray-900 border border-yellow-500 rounded-xl shadow-lg px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:shadow-yellow-600/30"
            >
              {/* Left: Start Time */}
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium min-w-[90px] justify-center sm:justify-start">
                <Clock3 size={16} />
                {time}
              </div>

              {/* Center: Matka Name + Winning Number */}
              <div className="flex-1 text-center space-y-1">
                <h4 className="uppercase font-bold text-yellow-200 text-sm sm:text-base tracking-wide">
                  {item.matkaId.betName}
                </h4>

                <div className="relative w-16 h-12 mx-auto">
                  <Ticket
                    size={64}
                    className="text-yellow-400 fill-yellow-400"
                  />
                  <span className="absolute inset-0 top-4 flex items-center justify-center font-bold text-xl text-black">
                    {item.number}
                  </span>
                </div>
              </div>

              {/* Right: Result Time */}
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium min-w-[90px] justify-center sm:justify-end">
                {time1}
                <Clock3 size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const MatkaTimeTable = () => {
  const { matkas } = useCommon();
  return (
    <section className="py-12 bg-black text-white px-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-400 inline-flex items-center gap-2">
          <CalendarClock className="text-green-400" size={24} />
          🎲 Result Time Table
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Check when your luck unfolds!
        </p>
      </div>
      <div className="max-w-3xl mx-auto bg-gray-900 border border-yellow-700 rounded-lg shadow-lg">
        <ul className="divide-y divide-yellow-800">
          {matkas.map((slot, index) => {
            const time = new Date(slot.timeTable!).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
            return (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:bg-yellow-900 transition"
              >
                <div className="flex items-center gap-2 text-yellow-200 uppercase font-medium">
                  <AlarmClockCheck size={18} className="text-green-500" />
                  {time}
                </div>
                <span className="text-sm font-semibold uppercase text-yellow-400 tracking-wide">
                  {slot.betName}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

const steps = [
  {
    icon: <LogIn className="mx-auto text-yellow-400 mb-3" size={32} />,
    title: "Login or Register",
    description:
      "Create an account or login to your existing account to begin.",
  },
  {
    icon: <Wallet className="mx-auto text-yellow-400 mb-3" size={32} />,
    title: "Add Money",
    description: (
      <>
        Go to <span className="underline">Profile → Add Money</span> to top up
        your wallet.
      </>
    ),
  },
  {
    icon: <Dice5 className="mx-auto text-yellow-400 mb-3" size={32} />,
    title: "Start Playing",
    description: "Pick your numbers and place your bets to win big.",
  },
];

const fadeUp1 = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const HowToPlaySection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-yellow-300">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-extrabold mb-2 text-yellow-400">
          How to Play
        </h2>
        <p className="text-sm text-yellow-200">
          Just 3 simple steps to get started
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={fadeUp1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-zinc-950 border border-yellow-600 rounded-lg p-6 text-center shadow-md hover:shadow-yellow-400/30 transition"
          >
            {step.icon}
            <h4 className="text-lg font-bold mb-1 text-yellow-100">
              {step.title}
            </h4>
            <p className="text-sm text-yellow-300">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const faqs = [
  {
    question: "Is this platform trustworthy?",
    answer:
      "Absolutely. We prioritize fairness and transparency. Every game is recorded, and your transactions are secure with industry-standard encryption. Thousands of players trust us daily.",
  },
  {
    question: "How can I build confidence before playing?",
    answer:
      "We recommend starting with small bets and exploring the platform. Use the demo modes or observe previous results to understand patterns and build your strategy.",
  },
  {
    question: "How do I earn real money?",
    answer:
      "You earn money by placing successful bets. Each game offers different odds, and the more you understand the patterns and trends, the better your chances. Your wallet reflects your winnings in real-time.",
  },
  {
    question: "Is it safe to add money to my wallet?",
    answer:
      "Yes, we use secure payment gateways with fraud protection. All transactions are logged and visible in your profile’s transaction history.",
  },
  {
    question: "What makes this platform different?",
    answer:
      "Our platform blends entertainment with opportunity. We focus on community, fair chances, and features like instant withdrawal, referral rewards, and AI-backed game support to boost your confidence.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 text-yellow-300">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-yellow-200">
          Understand the system, build trust, and play confidently.
        </p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="bg-zinc-900 border border-yellow-700 rounded-lg"
          >
            <button
              className="flex justify-between items-center w-full px-5 py-4 text-left text-yellow-100 hover:bg-zinc-800 transition"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-md font-semibold">{faq.question}</span>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-4 text-sm text-yellow-200">
                {faq.answer}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="bg-black text-yellow-300 py-16 px-6" id="contact">
      <div className="max-w-5xl mx-auto text-center">
        {/* Contact Icons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-10">
          <div className="flex items-center gap-3">
            <PhoneCall size={24} className="text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Call Us</p>
              <p className="text-lg font-bold text-yellow-300">
                +91 0000000000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={24} className="text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Email Support</p>
              <p className="text-lg font-bold text-yellow-300">
                support@matkacasino.com
              </p>
            </div>
          </div>
        </div>

        {/* Informational Content */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold mb-4">We're Here to Help</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Whether you're new to online Matka or a seasoned player, our support
            team is just a call or email away. Feel free to reach out with any
            questions regarding account setup, withdrawals, betting rules, or
            anything else. We're available 24/7 to make sure your experience is
            safe, fair, and exciting.
          </p>
        </div>
      </div>
    </section>
  );
};

const DisclaimerSection = () => {
  return (
    <section className="bg-zinc-900 text-yellow-300 py-10 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4 uppercase">Disclaimer</h2>
        <p className="text-sm text-yellow-200 leading-relaxed">
          The games and content presented on this platform are strictly intended
          for entertainment and educational purposes only. We do not promote or
          encourage real-money gambling. Any resemblance to actual betting or
          wagering is purely coincidental and used solely for learning and
          simulation. Users must be 18 years of age or older to access this
          site. Always play responsibly and understand that this platform does
          not offer any monetary rewards or risks.
        </p>
      </div>
    </section>
  );
};

const fakeUsers = [
  { name: "Amit P.", amount: 200 },
  { name: "Sara M.", amount: 500 },
  { name: "John D.", amount: 100 },
  { name: "Kiran R.", amount: 350 },
  { name: "Ravi S.", amount: 150 },
  { name: "Zara A.", amount: 400 },
];

const LiveBetPopup = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const showPopup = () => {
      const random = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
      setCurrentUser(random);
      setVisible(true);

      // Hide after 2.5s, then schedule next in 15s total
      timeoutId = setTimeout(() => {
        setVisible(false);

        // Wait a bit before showing next popup
        timeoutId = setTimeout(showPopup, 12500); // 15s total including 2.5s visible
      }, 2500);
    };

    // Start cycle
    showPopup();

    return () => clearTimeout(timeoutId); // cleanup
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-opacity duration-500 ease-in-out 
        ${
          visible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        } 
        bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 text-black border border-yellow-700 animate-pulse`}
    >
      <Dice5 size={20} className="text-black" />
      <span className="text-sm font-semibold">
        <strong>{currentUser?.name}</strong> placed a bet of ₹
        {currentUser?.amount}
      </span>
    </div>
  );
};

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      {/* <LiveBetPopup /> */}
      <Rates />
      <MatkaResults />
      <MatkaTimeTable />
      <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-800">
        <HowToPlaySection />
        <FaqSection />
      </div>
      <ContactSection />
      <DisclaimerSection />
    </Layout>
  );
}
