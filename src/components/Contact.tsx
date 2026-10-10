import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import RetroGame from "./RetroGame";
import NowPlaying from "./NowPlaying";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import EmailBot from "./EmailBot";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setForm({ name: "", email: "", message: "", website: "" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    // Animate title from bottom
    contactTimeline.fromTo(
      ".contact-section h3",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );

    // Animate contact boxes with stagger from bottom
    contactTimeline.fromTo(
      ".contact-box",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // Clean up
    return () => {
      contactTimeline.kill();
    };
  }, []);

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{config.developer.fullName}</h3>
        <div className="contact-main">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h4>Send me a message</h4>
          <div className="contact-form-row">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              maxLength={100}
              data-cursor="disable"
            />
            <div className="email-field">
              <input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                data-cursor="disable"
              />
              <EmailBot value={form.email} onFix={(email) => setForm({ ...form, email })} />
            </div>
          </div>
          <textarea
            placeholder="Your message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            maxLength={5000}
            data-cursor="disable"
          />
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ display: "none" }}
          />
          <button type="submit" disabled={status === "sending"} data-cursor="disable">
            {status === "sending" ? "Sending..." : "Send Message"} <MdArrowOutward />
          </button>
          {status === "sent" && <p className="contact-form-status ok">Message sent. I'll get back to you soon.</p>}
          {status === "error" && <p className="contact-form-status err">Could not send. Please email me directly.</p>}
        </form>
        <RetroGame />
        </div>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${config.contact.email}`} className="contact-email" data-cursor="disable">
                {config.contact.email}
              </a>
            </p>
            <h4>Location</h4>
            <p>
              <span>{config.social.location}</span>
            </p>
            <NowPlaying />
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={config.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={config.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href={config.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Portfolio <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box contact-credit">
            <p className="contact-credit-label">Portfolio 2026</p>
            <h2>
              Designed + built <br /> by <span>{config.developer.fullName}</span>
            </h2>
            <p className="contact-credit-location">Bengaluru, India</p>
            <p className="contact-credit-sponsor">
              <b>PLAYER 2 · SPONSOR</b>
              <span>my brother, who funds most of my builds</span>
            </p>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
