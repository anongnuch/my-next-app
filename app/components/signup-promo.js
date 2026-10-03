export default function SignupPromo() {
  return (
    <aside className="flex h-full flex-col justify-center rounded-md bg-brand-soft p-6 text-center">
      <p className="text-[26px] font-extrabold text-sale">15% OFF</p>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">
        For new member sign up at the first time
      </p>

      <form className="mt-5 space-y-2.5" action="#">
        <label className="sr-only" htmlFor="promo-email">
          Email address
        </label>
        <input
          id="promo-email"
          type="email"
          placeholder="yourdomain@gmail.com"
          className="h-10 w-full rounded border border-line bg-background px-3 text-[12px] outline-none placeholder:text-muted focus:border-brand"
        />
        <label className="sr-only" htmlFor="promo-name">
          Full name
        </label>
        <input
          id="promo-name"
          type="text"
          placeholder="Your name"
          className="h-10 w-full rounded border border-line bg-background px-3 text-[12px] outline-none placeholder:text-muted focus:border-brand"
        />
        <label className="sr-only" htmlFor="promo-phone">
          Phone number
        </label>
        <input
          id="promo-phone"
          type="tel"
          placeholder="Your phone number"
          className="h-10 w-full rounded border border-line bg-background px-3 text-[12px] outline-none placeholder:text-muted focus:border-brand"
        />
        <button
          type="submit"
          className="h-10 w-full rounded bg-brand text-[13px] font-bold transition-colors hover:bg-brand-strong"
        >
          Register Now
        </button>
      </form>
    </aside>
  );
}
