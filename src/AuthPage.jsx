import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ChevronDown,
  Loader2,
  CheckCircle2,
  X,
  ArrowRight,
  Building2,
  Crown,
  Landmark,
  ArrowLeft,
} from "lucide-react";

/* ------------------------------------------------------------------
   Brand tokens ­— exact hex values from the brand guide. These are
   applied via inline style / CSS custom properties rather than
   Tailwind arbitrary-value classes, since this environment only
   ships Tailwind's precompiled default stylesheet.
------------------------------------------------------------------- */
const COLORS = {
  primaryBlue: "#4A80B7",
  secondaryBlue: "#AA80B7",
  deepBlue: "#2F5F8F",
  accentYellow: "#F2C94C",
  white: "#FFFFFF",
  lightGray: "#F2F2F2",
  darkGray: "#4B5563",
};

const ROLES = [
  { value: "", label: "Pilih peran / jabatan" },
  { value: "bau", label: "Bagian Administrasi Umum (BAU)" },
  { value: "dekan", label: "Dekan Fakultas" },
  { value: "rektor", label: "Rektor" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------
   Small inline icons for third-party providers
------------------------------------------------------------------- */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C40.9 36 44 30.9 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37 59 127.6 107.2 126.1 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-83.1 102.6-120.2-65.2-30.7-61.7-90-61.7-91.9zM256.7 82.9c26.9-32 24.5-61.2 23.7-71.7-23.8 1.4-51.4 16.4-67.2 34.9-17.5 19.8-27.8 44.3-25.6 70.4 25.2 2 48.1-10.7 69.1-33.6z" />
    </svg>
  );
}

/* ------------------------------------------------------------------
   Reusable input field
------------------------------------------------------------------- */
function InputField({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  rightSlot,
  autoComplete,
}) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Icon size={18} style={{ color: error ? "#DC2626" : COLORS.primaryBlue }} />
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="brand-input w-full rounded-xl border py-2.5 pl-11 pr-11 text-sm outline-none transition"
          style={{
            borderColor: error ? "#DC2626" : "#E2E5EA",
            color: COLORS.darkGray,
            backgroundColor: "#FAFBFC",
          }}
        />
        {rightSlot && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5">{rightSlot}</span>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function EyeToggle({ visible, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-md p-0.5 text-gray-400 transition hover:text-gray-600"
      tabIndex={-1}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

/* ------------------------------------------------------------------
   Disposition flow illustration — the signature element.
   A stylised visual of a letter routed BAU → Dekan → Rektor,
   echoing what the product actually does.
------------------------------------------------------------------- */
function DispositionFlow() {
  const nodes = [
    { icon: Mail, label: "Surat Masuk", sub: "BAU" },
    { icon: Building2, label: "Disposisi", sub: "Dekan" },
    { icon: Crown, label: "Persetujuan", sub: "Rektor" },
  ];
  return (
    <div className="relative mt-10 w-full max-w-sm">
      <div className="absolute" style={{ left: "16.5%", right: "16.5%", top: "24px", height: "2px", backgroundColor: "rgba(255,255,255,0.25)" }} />
      <div
        className="dispo-runner absolute flex h-6 w-6 items-center justify-center rounded-full shadow-lg"
        style={{ top: "12px", backgroundColor: COLORS.accentYellow }}
      >
        <Mail size={13} style={{ color: COLORS.deepBlue }} />
      </div>
      <div className="relative flex items-start justify-between">
        {nodes.map((n, i) => (
          <div key={i} className="flex w-1/3 flex-col items-center text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", boxShadow: "0 0 0 4px rgba(255,255,255,0.18)" }}
            >
              <n.icon size={20} className="text-white" />
            </div>
            <p className="mt-3 text-xs font-semibold text-white" style={{ opacity: 0.95 }}>{n.label}</p>
            <p className="text-xs text-white" style={{ opacity: 0.6 }}>{n.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Toast
------------------------------------------------------------------- */
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div className="toast-in fixed left-1/2 top-5 z-50 max-w-sm -translate-x-1/2" style={{ width: "92%" }}>
      <div
        className="flex items-start gap-3 rounded-xl border bg-white p-3.5 shadow-xl"
        style={{ borderColor: isSuccess ? "#BBF7D0" : "#FECACA" }}
      >
        <CheckCircle2
          size={20}
          className="mt-0.5 shrink-0"
          style={{ color: isSuccess ? "#16A34A" : "#DC2626" }}
        />
        <p className="flex-1 text-sm leading-snug" style={{ color: COLORS.darkGray }}>
          {toast.text}
        </p>
        <button onClick={onClose} className="shrink-0 text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Phone / OTP modal
------------------------------------------------------------------- */
function PhoneOtpModal({ open, onClose, onVerified }) {
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setPhoneError("");
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setVerifying(false);
      setOtpError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open || step !== "otp") return;
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [open, step, timer]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submitPhone = (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 9) {
      setPhoneError("Masukkan nomor telepon/WhatsApp yang valid.");
      return;
    }
    setPhoneError("");
    setStep("otp");
    setTimer(60);
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  };

  const handleOtpChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setOtpError("");
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const resend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const verify = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Masukkan 6 digit kode OTP.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onVerified(phone);
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(21,38,58,0.55)" }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {step === "otp" && (
              <button
                onClick={() => setStep("phone")}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                aria-label="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h3 className="text-base font-bold" style={{ color: COLORS.deepBlue }}>
              {step === "phone" ? "Masuk dengan Nomor Telepon" : "Verifikasi Kode OTP"}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600" aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        {step === "phone" ? (
          <form onSubmit={submitPhone} className="space-y-4">
            <p className="text-sm" style={{ color: COLORS.darkGray }}>
              Masukkan nomor WhatsApp aktif Anda. Kode verifikasi 6 digit akan dikirimkan.
            </p>
            <InputField
              id="modal-phone"
              label="Nomor Telepon/WhatsApp"
              icon={Phone}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xx-xxxx-xxxx"
              error={phoneError}
              autoComplete="tel"
            />
            <button type="submit" className="brand-btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold">
              Kirim Kode OTP <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-5">
            <p className="text-sm" style={{ color: COLORS.darkGray }}>
              Kode telah dikirim ke <span className="font-semibold">{phone || "nomor Anda"}</span>. Masukkan 6 digit kode di bawah ini.
            </p>
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-box h-12 w-11 rounded-xl border text-center text-lg font-bold outline-none transition"
                  style={{ borderColor: otpError ? "#DC2626" : "#E2E5EA", color: COLORS.deepBlue }}
                />
              ))}
            </div>
            {otpError && <p className="-mt-3 text-xs font-medium text-red-600">{otpError}</p>}

            <button
              type="submit"
              disabled={verifying}
              className="brand-btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold disabled:opacity-70"
            >
              {verifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Memverifikasi...
                </>
              ) : (
                "Verifikasi Kode"
              )}
            </button>

            <div className="text-center text-xs" style={{ color: COLORS.darkGray }}>
              {timer > 0 ? (
                <span>
                  Kirim ulang kode dalam{" "}
                  <span className="font-semibold" style={{ color: COLORS.deepBlue }}>
                    00:{String(timer).padStart(2, "0")}
                  </span>
                </span>
              ) : (
                <button type="button" onClick={resend} className="font-semibold hover:underline" style={{ color: COLORS.primaryBlue }}>
                  Kirim Ulang Kode
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Social login row
------------------------------------------------------------------- */
function SocialRow({ onPhoneClick }) {
  return (
    <div>
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: "#E5E7EB" }} />
        <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
          Atau masuk dengan
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: "#E5E7EB" }} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button type="button" className="social-btn flex items-center justify-center rounded-xl border py-2.5" aria-label="Masuk dengan Google">
          <GoogleMark />
        </button>
        <button type="button" className="social-btn flex items-center justify-center rounded-xl border py-2.5" style={{ color: "#111827" }} aria-label="Masuk dengan Apple">
          <AppleMark />
        </button>
        <button
          type="button"
          onClick={onPhoneClick}
          className="social-btn flex items-center justify-center rounded-xl border py-2.5"
          style={{ color: COLORS.deepBlue }}
          aria-label="Masuk dengan Nomor Telepon"
        >
          <Phone size={18} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Login form
------------------------------------------------------------------- */
function LoginForm({ onSwitch, onPhoneClick, showToast, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const idError = touched.identifier && identifier.trim().length === 0 ? "Email atau username wajib diisi." : "";
  const pwError = touched.password && password.length === 0 ? "Password wajib diisi." : "";

  const canSubmit = identifier.trim().length > 0 && password.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ identifier: true, password: true });
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast({ type: "success", text: "Login berhasil! Mengarahkan Anda ke dashboard sesuai peran Anda..." });
      setTimeout(() => onLoginSuccess && onLoginSuccess(), 900);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        id="login-identifier"
        label="Email atau Username"
        icon={Mail}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, identifier: true }))}
        placeholder="nama@kampus.ac.id"
        error={idError}
        autoComplete="username"
      />
      <InputField
        id="login-password"
        label="Password"
        type={showPw ? "text" : "password"}
        icon={Lock}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        placeholder="••••••••"
        error={pwError}
        autoComplete="current-password"
        rightSlot={<EyeToggle visible={showPw} onClick={() => setShowPw((v) => !v)} label="Tampilkan password" />}
      />

      <div className="flex items-center justify-between pt-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: COLORS.darkGray }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded"
            style={{ accentColor: COLORS.primaryBlue }}
          />
          Ingat Saya
        </label>
        <button type="button" className="text-sm font-medium hover:underline" style={{ color: COLORS.primaryBlue }}>
          Lupa Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="brand-btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </button>

      <SocialRow onPhoneClick={onPhoneClick} />

      <p className="pt-2 text-center text-sm" style={{ color: COLORS.darkGray }}>
        Belum punya akun?{" "}
        <button type="button" onClick={onSwitch} className="font-bold hover:underline" style={{ color: COLORS.deepBlue }}>
          Daftar di sini
        </button>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------
   Register form
------------------------------------------------------------------- */
function RegisterForm({ onSwitch, onPhoneClick, onRegistered }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const nameError = touched.fullName && fullName.trim().length === 0 ? "Nama lengkap wajib diisi." : "";
  const emailError = touched.email && email.length > 0 && !EMAIL_RE.test(email) ? "Format email tidak valid." : touched.email && email.length === 0 ? "Email wajib diisi." : "";
  const phoneError = touched.phone && phone.replace(/\D/g, "").length < 9 ? "Nomor telepon tidak valid." : "";
  const pwError = touched.password && password.length > 0 && password.length < 8 ? "Password minimal 8 karakter." : touched.password && password.length === 0 ? "Password wajib diisi." : "";
  const confirmError = touched.confirm && confirm.length > 0 && confirm !== password ? "Konfirmasi password tidak cocok." : touched.confirm && confirm.length === 0 ? "Konfirmasi password wajib diisi." : "";
  const roleError = touched.role && role === "" ? "Pilih peran/jabatan Anda." : "";

  const canSubmit =
    fullName.trim().length > 0 &&
    EMAIL_RE.test(email) &&
    phone.replace(/\D/g, "").length >= 9 &&
    password.length >= 8 &&
    confirm === password &&
    role !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true, password: true, confirm: true, role: true });
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onRegistered();
    }, 1300);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        id="reg-name"
        label="Nama Lengkap"
        icon={User}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
        placeholder="Nama sesuai identitas resmi"
        error={nameError}
        autoComplete="name"
      />
      <InputField
        id="reg-email"
        label="Email Instansi/Aktif"
        icon={Mail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        placeholder="nama@kampus.ac.id"
        error={emailError}
        autoComplete="email"
      />
      <InputField
        id="reg-phone"
        label="Nomor Telepon/WhatsApp"
        icon={Phone}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
        placeholder="Untuk verifikasi OTP"
        error={phoneError}
        autoComplete="tel"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          id="reg-password"
          label="Password"
          type={showPw ? "text" : "password"}
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          placeholder="Min. 8 karakter"
          error={pwError}
          autoComplete="new-password"
          rightSlot={<EyeToggle visible={showPw} onClick={() => setShowPw((v) => !v)} label="Tampilkan password" />}
        />
        <InputField
          id="reg-confirm"
          label="Konfirmasi Password"
          type={showConfirm ? "text" : "password"}
          icon={Lock}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          placeholder="Ulangi password"
          error={confirmError}
          autoComplete="new-password"
          rightSlot={<EyeToggle visible={showConfirm} onClick={() => setShowConfirm((v) => !v)} label="Tampilkan konfirmasi password" />}
        />
      </div>

      <div className="w-full">
        <label htmlFor="reg-role" className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>
          Pilih Peran/Jabatan
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Landmark size={18} style={{ color: roleError ? "#DC2626" : COLORS.primaryBlue }} />
          </span>
          <select
            id="reg-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, role: true }))}
            className="brand-input w-full appearance-none rounded-xl border py-2.5 pl-11 pr-10 text-sm outline-none transition"
            style={{ borderColor: roleError ? "#DC2626" : "#E2E5EA", color: role ? COLORS.darkGray : "#9CA3AF", backgroundColor: "#FAFBFC" }}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value} disabled={r.value === ""}>
                {r.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <ChevronDown size={16} style={{ color: "#9CA3AF" }} />
          </span>
        </div>
        {roleError && <p className="mt-1 text-xs font-medium text-red-600">{roleError}</p>}
      </div>

      <p className="rounded-lg px-3 py-2 text-xs leading-relaxed" style={{ backgroundColor: COLORS.lightGray, color: COLORS.darkGray }}>
        Akun BAU, Rektor, dan Dekan memerlukan persetujuan Super Admin sebelum dapat digunakan.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="brand-btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Mendaftarkan...
          </>
        ) : (
          "Daftar Akun Sekarang"
        )}
      </button>

      <SocialRow onPhoneClick={onPhoneClick} />

      <p className="pt-2 text-center text-sm" style={{ color: COLORS.darkGray }}>
        Sudah punya akun?{" "}
        <button type="button" onClick={onSwitch} className="font-bold hover:underline" style={{ color: COLORS.deepBlue }}>
          Masuk di sini
        </button>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------
   Pending-approval confirmation screen (shown after register)
------------------------------------------------------------------- */
function PendingApproval({ onBackToLogin }) {
  return (
    <div className="pending-in flex flex-col items-center py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "#FEF6E0" }}>
        <CheckCircle2 size={32} style={{ color: COLORS.accentYellow }} />
      </div>
      <h3 className="mt-5 text-lg font-bold" style={{ color: COLORS.deepBlue }}>
        Pendaftaran Berhasil
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: COLORS.darkGray }}>
        Akun Anda sedang menunggu persetujuan <span className="font-semibold">Super Admin</span>. Anda akan menerima notifikasi melalui email/WhatsApp setelah akun diaktifkan.
      </p>
      <button onClick={onBackToLogin} className="brand-btn-primary mt-6 rounded-xl px-6 py-2.5 text-sm font-bold">
        Kembali ke Halaman Masuk
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
   Root component
------------------------------------------------------------------- */
export default function AuthPage({ onLoginSuccess } = {}) {
  const [mode, setMode] = useState("login"); // login | register
  const [registerDone, setRegisterDone] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((t) => {
    setToast(t);
    setTimeout(() => setToast(null), 4200);
  }, []);

  const switchMode = (next) => {
    setRegisterDone(false);
    setMode(next);
  };

  const handleOtpVerified = () => {
    setPhoneModalOpen(false);
    showToast({ type: "success", text: "Verifikasi berhasil! Anda masuk melalui nomor telepon." });
    setTimeout(() => onLoginSuccess && onLoginSuccess(), 700);
  };

  return (
    <div className="min-h-screen w-full font-sans" style={{ backgroundColor: COLORS.primaryBlue }}>
      <style>{`
        .brand-input:focus {
          border-color: ${COLORS.primaryBlue} !important;
          box-shadow: 0 0 0 3px rgba(74,128,183,0.18);
          background-color: #FFFFFF !important;
        }
        .otp-box:focus {
          border-color: ${COLORS.primaryBlue} !important;
          box-shadow: 0 0 0 3px rgba(74,128,183,0.18);
        }
        .brand-btn-primary {
          background-color: ${COLORS.accentYellow};
          color: ${COLORS.deepBlue};
          transition: background-color .18s ease, transform .12s ease;
        }
        .brand-btn-primary:hover:not(:disabled) {
          background-color: #E6B93E;
        }
        .brand-btn-primary:active:not(:disabled) {
          transform: scale(0.98);
        }
        .social-btn {
          border-color: #E5E7EB;
          transition: border-color .15s ease, background-color .15s ease;
        }
        .social-btn:hover {
          border-color: ${COLORS.primaryBlue};
          background-color: #F8FAFC;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-in { animation: cardIn .5s ease both; }

        @keyframes formSwitch {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .form-switch { animation: formSwitch .32s ease both; }

        @keyframes pendingIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .pending-in { animation: pendingIn .35s ease both; }

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-in { animation: modalIn .22s ease both; }

        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .toast-in { animation: toastIn .28s ease both; }

        @keyframes runnerMove {
          0%   { left: 16.5%; }
          50%  { left: 47%; }
          100% { left: 77%; }
        }
        .dispo-runner {
          animation: runnerMove 4.5s ease-in-out infinite alternate;
        }
      `}</style>

      <Toast toast={toast} onClose={() => setToast(null)} />
      <PhoneOtpModal open={phoneModalOpen} onClose={() => setPhoneModalOpen(false)} onVerified={handleOtpVerified} />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl lg:grid lg:grid-cols-2">
        {/* Left branding panel */}
        <div
          className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
          style={{
            backgroundImage: `linear-gradient(150deg, ${COLORS.deepBlue} 0%, ${COLORS.primaryBlue} 65%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
            style={{ backgroundColor: COLORS.secondaryBlue, opacity: 0.35 }}
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: COLORS.deepBlue, opacity: 0.5 }}
          />

          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <Landmark size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none text-white">SIM Disposisi Surat</p>
              <p className="mt-1 text-xs leading-none text-white" style={{ opacity: 0.6 }}>Sistem Informasi Manajemen</p>
            </div>
          </div>

          <div className="relative">
            <h1 className="font-serif text-3xl font-bold leading-tight text-white">
              Disposisi surat masuk, tertata dan terlacak dari satu pintu.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white" style={{ opacity: 0.75 }}>
              Rutekan surat dari Bagian Administrasi Umum menuju Dekan dan Rektor secara digital — cepat, terdokumentasi, dan aman.
            </p>
            <DispositionFlow />
          </div>

          <p className="relative text-xs text-white" style={{ opacity: 0.5 }}>© {new Date().getFullYear()} Universitas — Seluruh hak dilindungi.</p>
        </div>

        {/* Right form panel */}
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile-only brand header */}
            <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: COLORS.deepBlue }}>
                <Landmark size={18} className="text-white" />
              </div>
              <p className="text-sm font-bold" style={{ color: COLORS.white }}>
                SIM Disposisi Surat
              </p>
            </div>

            <div className="card-in rounded-3xl p-7 shadow-2xl sm:p-9" style={{ backgroundColor: COLORS.white }}>
              {mode === "register" && registerDone ? (
                <PendingApproval onBackToLogin={() => switchMode("login")} />
              ) : (
                <div key={mode} className="form-switch">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold" style={{ color: COLORS.deepBlue }}>
                      {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>
                      {mode === "login"
                        ? "Masuk untuk mengelola disposisi surat Anda."
                        : "Lengkapi data di bawah untuk mengajukan akun."}
                    </p>
                  </div>

                  {mode === "login" ? (
                    <LoginForm onSwitch={() => switchMode("register")} onPhoneClick={() => setPhoneModalOpen(true)} showToast={showToast} onLoginSuccess={onLoginSuccess} />
                  ) : (
                    <RegisterForm
                      onSwitch={() => switchMode("login")}
                      onPhoneClick={() => setPhoneModalOpen(true)}
                      onRegistered={() => setRegisterDone(true)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}