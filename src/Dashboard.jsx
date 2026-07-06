import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  LayoutDashboard,
  FilePlus2,
  FileSignature,
  Inbox,
  Archive,
  ChevronDown,
  Bell,
  FileInput,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  Timer,
  UploadCloud,
  FileCheck2,
  X,
  Search,
  PenTool,
  Eraser,
  Download,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  AlertTriangle,
  Check,
  Landmark,
  Loader2,
  LogOut,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------
   Brand tokens — from the official design system doc.
   Applied via inline style / plain CSS, not Tailwind arbitrary
   classes, since only Tailwind's precompiled default classes render
   reliably in this environment.
------------------------------------------------------------------- */
const COLORS = {
  primaryBlue: "#AA80B7",
  deepBlue: "#2F5F8F",
  lightBlue: "#7FA6D1",
  ultraLightBlue: "#BFD6F0",
  iceBlue: "#EAF4FB",
  accentYellow: "#F2C94C",
  warmOrange: "#F2994A",
  softTeal: "#56CCF2",
  coolCyan: "#00B2E3",
  white: "#FFFFFF",
  lightGray: "#F2F2F2",
  gray100: "#E5E7EB",
  gray200: "#C7CCD3",
  darkGray: "#4B5563",
  success: "#27AE60",
  info: "#2D9CDB",
  warning: "#F2A900",
  error: "#E74C3C",
};

const ROLE_META = {
  bau: { label: "Bagian Administrasi Umum", short: "BAU", initials: "BA" },
  rektor: { label: "Rektor", short: "Rektor", initials: "RK" },
  dekan: { label: "Dekan Fakultas", short: "Dekan", initials: "DK" },
};

/* ------------------------------------------------------------------
   Mock data
------------------------------------------------------------------- */
const STATUS_META = {
  Draft: { dot: "#9CA3AF", text: "#6B7280", bg: "rgba(156,163,175,0.15)" },
  "Menunggu Review Rektor": { dot: "#F2A900", text: "#8A5A00", bg: "rgba(242,169,0,0.14)" },
  "Selesai Ditandatangani Rektor": { dot: "#2D9CDB", text: "#1B6FA8", bg: "rgba(45,156,219,0.14)" },
  "Approved/Disposed": { dot: "#56CCF2", text: "#0B7285", bg: "rgba(86,204,242,0.16)" },
  Closed: { dot: "#27AE60", text: "#1E7E45", bg: "rgba(39,174,96,0.14)" },
  "Perlu Revisi": { dot: "#E74C3C", text: "#B23325", bg: "rgba(231,76,60,0.14)" },
};

const INITIAL_LETTERS = [
  { id: 1, nomorSurat: "005/EXT/UNV/VII/2026", pengirim: "Kemendikbudristek RI", perihal: "Undangan Rapat Koordinasi Akreditasi Nasional", tanggalSurat: "2026-06-28", sifat: "Penting", fakultasTujuan: "Fakultas Teknik", status: "Menunggu Review Rektor" },
  { id: 2, nomorSurat: "—", pengirim: "PT Sinergi Edukasi Nusantara", perihal: "Penawaran Kerja Sama Program Beasiswa Mahasiswa", tanggalSurat: "2026-07-01", sifat: "Biasa", fakultasTujuan: "Fakultas Ekonomi", status: "Draft" },
  { id: 3, nomorSurat: "112/EXT/UGM/VI/2026", pengirim: "Universitas Gadjah Mada", perihal: "Undangan Seminar Nasional Riset Teknologi Terapan", tanggalSurat: "2026-06-20", sifat: "Biasa", fakultasTujuan: "Fakultas Teknik", status: "Selesai Ditandatangani Rektor" },
  { id: 4, nomorSurat: "088/EXT/DISDIK/VI/2026", pengirim: "Dinas Pendidikan Provinsi Jawa Timur", perihal: "Permohonan Data Alumni untuk Tracer Study 2026", tanggalSurat: "2026-06-18", sifat: "Biasa", fakultasTujuan: "Fakultas Ekonomi", status: "Approved/Disposed" },
  { id: 5, nomorSurat: "073/EXT/YPN/VI/2026", pengirim: "Yayasan Pendidikan Nusantara", perihal: "Proposal Hibah Penelitian Dosen Tahun Anggaran 2026", tanggalSurat: "2026-06-10", sifat: "Penting", fakultasTujuan: "Fakultas Ekonomi", status: "Closed" },
  { id: 6, nomorSurat: "091/EXT/BNM/VI/2026", pengirim: "Bank Mitra Nasional", perihal: "Kerja Sama Layanan Perbankan Kampus Merdeka", tanggalSurat: "2026-06-25", sifat: "Rahasia", fakultasTujuan: "Fakultas Ekonomi", status: "Menunggu Review Rektor" },
  { id: 7, nomorSurat: "045/EXT/IKAH/V/2026", pengirim: "Ikatan Alumni Fakultas Hukum", perihal: "Undangan Reuni Akbar Alumni Angkatan 2005–2015", tanggalSurat: "2026-05-30", sifat: "Biasa", fakultasTujuan: "Fakultas Hukum", status: "Perlu Revisi" },
  { id: 8, nomorSurat: "060/EXT/KEMENAG/V/2026", pengirim: "Kantor Wilayah Kementerian Agama", perihal: "Permohonan Narasumber Kegiatan Bulan Ramadhan", tanggalSurat: "2026-05-22", sifat: "Biasa", fakultasTujuan: "Fakultas Kedokteran", status: "Closed" },
  { id: 9, nomorSurat: "—", pengirim: "CV Bangun Cipta Konstruksi", perihal: "Penawaran Jasa Renovasi Gedung Fakultas Hukum", tanggalSurat: "2026-07-02", sifat: "Biasa", fakultasTujuan: "Fakultas Hukum", status: "Draft" },
];

const WEEKLY_DATA = [
  { minggu: "Minggu 1", jumlah: 14 },
  { minggu: "Minggu 2", jumlah: 19 },
  { minggu: "Minggu 3", jumlah: 9 },
  { minggu: "Minggu 4", jumlah: 22 },
];

const TIMELINE_STEPS = [
  { key: "eksternal", label: "Diterima dari Eksternal" },
  { key: "bau_in", label: "Registrasi & Disposisi (BAU)" },
  { key: "rektor", label: "Review & Tanda Tangan (Rektor)" },
  { key: "bau_verify", label: "Verifikasi & Arsip (BAU)" },
  { key: "dekan", label: "Diterima Dekan (Selesai)" },
];

function statusToStep(status) {
  switch (status) {
    case "Draft":
      return { step: 2, error: false };
    case "Perlu Revisi":
      return { step: 2, error: true };
    case "Menunggu Review Rektor":
      return { step: 3, error: false };
    case "Selesai Ditandatangani Rektor":
      return { step: 4, error: false };
    case "Approved/Disposed":
      return { step: 5, error: false };
    case "Closed":
      return { step: 6, error: false };
    default:
      return { step: 1, error: false };
  }
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard Utama", icon: LayoutDashboard, roles: ["bau", "rektor", "dekan"] },
  { id: "input", label: "Input Surat Masuk", icon: FilePlus2, roles: ["bau"] },
  { id: "workspace", label: "Ruang Kerja Disposisi", icon: FileSignature, roles: ["rektor"] },
  { id: "receiving", label: "Penerimaan Instruksi Kerja", icon: Inbox, roles: ["dekan"] },
  { id: "archive", label: "Arsip Surat", icon: Archive, roles: ["bau", "rektor", "dekan"] },
];

/* ------------------------------------------------------------------
   Small shared atoms
------------------------------------------------------------------- */
function Badge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Draft;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} />
      {status}
    </span>
  );
}

function MetricCard({ icon: Icon, label, value, accent, hint }) {
  return (
    <div className="rounded-2xl border p-5" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}1F` }}>
          <Icon size={19} style={{ color: accent }} />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold" style={{ color: COLORS.darkGray }}>
        {value}
      </p>
      <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>
        {label}
      </p>
      {hint && (
        <p className="mt-2 text-xs font-medium" style={{ color: accent }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className="fixed left-1/2 top-5 z-50 max-w-sm -translate-x-1/2" style={{ width: "92%" }}>
      <div className="toast-in flex items-start gap-3 rounded-xl border bg-white p-3.5 shadow-xl" style={{ borderColor: COLORS.gray100 }}>
        <CheckCircle2 size={20} className="mt-0.5 shrink-0" style={{ color: COLORS.success }} />
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

function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border py-24 text-center" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.iceBlue }}>
        <Archive size={24} style={{ color: COLORS.lightBlue }} />
      </div>
      <h3 className="mt-4 text-base font-bold" style={{ color: COLORS.deepBlue }}>
        {label}
      </h3>
      <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>
        Modul ini masih dalam tahap pengembangan.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
   Timeline / progress tracker
------------------------------------------------------------------- */
function Timeline({ currentStep, hasError, caption }) {
  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: COLORS.deepBlue }}>
          Alur Disposisi Surat
        </h3>
        {caption && (
          <p className="truncate text-xs" style={{ color: "#9CA3AF", maxWidth: "60%" }}>
            {caption}
          </p>
        )}
      </div>

      <div className="relative mt-8 px-2">
        <div className="absolute left-0 right-0 top-4 h-0.5" style={{ backgroundColor: COLORS.gray100 }} />
        <div
          className="absolute left-0 top-4 h-0.5 transition-all duration-500"
          style={{
            width: `${(Math.min(Math.max(currentStep - 1, 0), TIMELINE_STEPS.length - 1) / (TIMELINE_STEPS.length - 1)) * 100}%`,
            backgroundColor: hasError ? COLORS.error : COLORS.success,
          }}
        />
        <div className="relative flex justify-between">
          {TIMELINE_STEPS.map((s, idx) => {
            const stepNum = idx + 1;
            const done = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            let bg = COLORS.gray100;
            let iconColor = "#9CA3AF";
            let ring = "transparent";
            if (done) {
              bg = COLORS.success;
              iconColor = COLORS.white;
            }
            if (isCurrent) {
              bg = hasError ? COLORS.error : COLORS.warning;
              iconColor = COLORS.white;
              ring = hasError ? "rgba(231,76,60,0.25)" : "rgba(242,169,0,0.25)";
            }
            return (
              <div key={s.key} className="flex w-1/5 flex-col items-center text-center">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                  style={{ backgroundColor: bg, color: iconColor, boxShadow: isCurrent ? `0 0 0 5px ${ring}` : "none" }}
                >
                  {done ? <Check size={14} /> : isCurrent && hasError ? <AlertTriangle size={14} /> : stepNum}
                </div>
                <p
                  className="mt-2 hidden text-xs font-medium leading-tight sm:block"
                  style={{ color: isCurrent ? COLORS.darkGray : "#9CA3AF", maxWidth: "90px" }}
                >
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Weekly volume chart
------------------------------------------------------------------- */
function WeeklyChart() {
  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
      <h3 className="text-sm font-bold" style={{ color: COLORS.deepBlue }}>
        Volume Surat Masuk (4 Minggu Terakhir)
      </h3>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WEEKLY_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={COLORS.gray100} />
            <XAxis dataKey="minggu" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={{ stroke: COLORS.gray100 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: COLORS.iceBlue }}
              contentStyle={{ borderRadius: 10, borderColor: COLORS.gray100, fontSize: 12 }}
            />
            <Bar dataKey="jumlah" name="Surat Masuk" fill={COLORS.primaryBlue} radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Surat table
------------------------------------------------------------------- */
function SuratTable({ letters, role, selectedId, onSelect, onAction }) {
  const actionMeta = {
    bau: { label: "Lihat Detail", icon: Search },
    rektor: { label: "Tinjau & TTD", icon: PenTool },
    dekan: { label: "Unduh IK", icon: Download },
  }[role];

  const isActionEnabled = (status) => {
    if (role === "rektor") return status === "Menunggu Review Rektor";
    if (role === "dekan") return status === "Closed";
    return true;
  };

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
      <div className="flex items-center justify-between border-b p-5" style={{ borderColor: COLORS.gray100 }}>
        <h3 className="text-sm font-bold" style={{ color: COLORS.deepBlue }}>
          Daftar Surat Masuk
        </h3>
        <span className="text-xs" style={{ color: "#9CA3AF" }}>
          {letters.length} surat
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ backgroundColor: COLORS.iceBlue }}>
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold" style={{ color: COLORS.deepBlue }}>Nomor Surat</th>
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold" style={{ color: COLORS.deepBlue }}>Pengirim</th>
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold" style={{ color: COLORS.deepBlue }}>Perihal</th>
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold" style={{ color: COLORS.deepBlue }}>Tanggal</th>
              <th className="whitespace-nowrap px-5 py-3 text-xs font-semibold" style={{ color: COLORS.deepBlue }}>Status</th>
              <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold" style={{ color: COLORS.deepBlue }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {letters.map((l) => {
              const enabled = isActionEnabled(l.status);
              const Icon = actionMeta.icon;
              return (
                <tr
                  key={l.id}
                  onClick={() => onSelect(l.id)}
                  className="row-hover cursor-pointer border-b last:border-b-0"
                  style={{ borderColor: COLORS.gray100, backgroundColor: selectedId === l.id ? COLORS.iceBlue : "transparent" }}
                >
                  <td className="whitespace-nowrap px-5 py-3.5 font-semibold" style={{ color: COLORS.darkGray }}>{l.nomorSurat}</td>
                  <td className="truncate px-5 py-3.5" style={{ color: COLORS.darkGray, maxWidth: "180px" }}>{l.pengirim}</td>
                  <td className="truncate px-5 py-3.5" style={{ color: COLORS.darkGray, maxWidth: "240px" }}>{l.perihal}</td>
                  <td className="whitespace-nowrap px-5 py-3.5" style={{ color: COLORS.darkGray }}>{l.tanggalSurat}</td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <Badge status={l.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <button
                      type="button"
                      disabled={!enabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (enabled) onAction(l.id);
                      }}
                      className="action-btn inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ color: COLORS.deepBlue, backgroundColor: COLORS.iceBlue }}
                    >
                      <Icon size={13} />
                      {actionMeta.label}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Layar 1 — Dashboard Utama (semua aktor)
------------------------------------------------------------------- */
function DashboardHome({ role, letters, selectedId, onSelect, onAction }) {
  const counts = useMemo(() => {
    const by = (s) => letters.filter((l) => l.status === s).length;
    return {
      total: letters.length,
      draft: by("Draft"),
      menunggu: by("Menunggu Review Rektor"),
      ditandatangani: by("Selesai Ditandatangani Rektor"),
      disposed: by("Approved/Disposed"),
      closed: by("Closed"),
    };
  }, [letters]);

  const metrics = useMemo(() => {
    if (role === "bau") {
      return [
        { icon: Inbox, label: "Total Surat Masuk", value: counts.total, accent: COLORS.primaryBlue },
        { icon: FileInput, label: "Perlu Diproses (Draft)", value: counts.draft, accent: COLORS.warmOrange },
        { icon: Clock, label: "Menunggu Review Rektor", value: counts.menunggu, accent: COLORS.warning },
        { icon: Archive, label: "Sudah Diarsipkan", value: counts.disposed + counts.closed, accent: COLORS.success },
      ];
    }
    if (role === "rektor") {
      return [
        { icon: PenTool, label: "Menunggu Tanda Tangan", value: counts.menunggu, accent: COLORS.warning },
        { icon: CheckCircle2, label: "Ditandatangani Bulan Ini", value: 27 + counts.ditandatangani, accent: COLORS.success },
        { icon: Timer, label: "Rata-rata Waktu Respon", value: "1.4 hari", accent: COLORS.softTeal },
        { icon: FileText, label: "Total Surat Ditinjau", value: 154, accent: COLORS.primaryBlue },
      ];
    }
    return [
      { icon: Inbox, label: "Instruksi Kerja Baru", value: counts.closed, accent: COLORS.success },
      { icon: CheckCircle2, label: "Diterima Bulan Ini", value: 18 + counts.closed, accent: COLORS.softTeal },
      { icon: Building2, label: "Fakultas Aktif", value: new Set(letters.map((l) => l.fakultasTujuan)).size, accent: COLORS.primaryBlue },
      { icon: Clock, label: "Rata-rata Waktu Tunggu", value: "0.8 hari", accent: COLORS.warmOrange },
    ];
  }, [role, counts, letters]);

  const selected = letters.find((l) => l.id === selectedId) || letters[0];
  const { step, error } = statusToStep(selected.status);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      <Timeline currentStep={step} hasError={error} caption={`${selected.nomorSurat} — ${selected.perihal}`} />

      <div className="space-y-6">
        <SuratTable letters={letters} role={role} selectedId={selected.id} onSelect={onSelect} onAction={onAction} />
        <WeeklyChart />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   File dropzone
------------------------------------------------------------------- */
function FileDropzone({ file, onFile }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: COLORS.gray100, backgroundColor: COLORS.iceBlue }}>
        <div className="flex items-center gap-3">
          <FileCheck2 size={20} style={{ color: COLORS.success }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: COLORS.darkGray }}>{file.name}</p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        </div>
        <button type="button" onClick={() => onFile(null)} className="text-xs font-semibold" style={{ color: COLORS.error }}>
          Hapus
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 text-center transition"
      style={{ borderColor: dragOver ? COLORS.primaryBlue : COLORS.gray200, backgroundColor: dragOver ? COLORS.iceBlue : "#FAFBFC" }}
    >
      <UploadCloud size={26} style={{ color: COLORS.primaryBlue }} />
      <p className="mt-3 text-sm font-medium" style={{ color: COLORS.darkGray }}>
        Seret &amp; lepas berkas di sini, atau <span style={{ color: COLORS.primaryBlue }}>klik untuk memilih</span>
      </p>
      <p className="mt-1 text-xs" style={{ color: "#9CA3AF" }}>PDF, JPG, atau PNG — maks. 10MB</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
   Layar 2 — Input Surat (BAU)
------------------------------------------------------------------- */
function InputSuratForm({ onGenerate }) {
  const [form, setForm] = useState({ pengirim: "", nomorSurat: "", tanggalSurat: "", perihal: "", sifat: "Biasa" });
  const [file, setFile] = useState(null);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit = form.pengirim.trim() && form.nomorSurat.trim() && form.tanggalSurat && form.perihal.trim() && file;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      const seq = Math.floor(1000 + Math.random() * 8999);
      const disposisi1 = `DISP-${seq}/I/2026`;
      const disposisi2 = `DISP-${seq}/II/2026`;
      setSubmitting(false);
      setResult({ disposisi1, disposisi2 });
      onGenerate({ ...form, file });
    }, 1200);
  };

  const reset = () => {
    setForm({ pengirim: "", nomorSurat: "", tanggalSurat: "", perihal: "", sifat: "Biasa" });
    setFile(null);
    setTouched(false);
    setResult(null);
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border p-8 text-center" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(39,174,96,0.12)" }}>
          <CheckCircle2 size={28} style={{ color: COLORS.success }} />
        </div>
        <h3 className="mt-4 text-lg font-bold" style={{ color: COLORS.deepBlue }}>Lembar Disposisi Berhasil Dibuat</h3>
        <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>Surat akan diteruskan ke Rektor untuk ditinjau.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          <div className="rounded-xl border p-4" style={{ borderColor: COLORS.gray100 }}>
            <p className="text-xs font-semibold" style={{ color: COLORS.warning }}>DISPOSISI 1 — Diteruskan ke Rektor</p>
            <p className="mt-1.5 text-sm font-bold" style={{ color: COLORS.darkGray }}>{result.disposisi1}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: COLORS.gray100 }}>
            <p className="text-xs font-semibold" style={{ color: COLORS.softTeal }}>DISPOSISI 2 — Arsip Kendali (Read-Only)</p>
            <p className="mt-1.5 text-sm font-bold" style={{ color: COLORS.darkGray }}>{result.disposisi2}</p>
          </div>
        </div>

        <button onClick={reset} className="brand-btn-primary mt-7 rounded-xl px-6 py-2.5 text-sm font-bold">
          Input Surat Lainnya
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5 rounded-2xl border p-7" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
      <div>
        <h3 className="text-base font-bold" style={{ color: COLORS.deepBlue }}>Formulir Surat Masuk</h3>
        <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>Lengkapi data berikut untuk membuat Lembar Disposisi 1 &amp; 2 secara otomatis.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>Pengirim (Eksternal)</label>
          <input
            value={form.pengirim}
            onChange={set("pengirim")}
            placeholder="Nama instansi/perusahaan pengirim"
            className="brand-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
            style={{ borderColor: touched && !form.pengirim.trim() ? COLORS.error : COLORS.gray100 }}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>Nomor Surat</label>
          <input
            value={form.nomorSurat}
            onChange={set("nomorSurat")}
            placeholder="Nomor surat dari pengirim"
            className="brand-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
            style={{ borderColor: touched && !form.nomorSurat.trim() ? COLORS.error : COLORS.gray100 }}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>Tanggal Surat</label>
          <input
            type="date"
            value={form.tanggalSurat}
            onChange={set("tanggalSurat")}
            className="brand-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
            style={{ borderColor: touched && !form.tanggalSurat ? COLORS.error : COLORS.gray100 }}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>Kategori/Sifat</label>
          <div className="relative">
            <select
              value={form.sifat}
              onChange={set("sifat")}
              className="brand-input w-full appearance-none rounded-xl border px-4 py-2.5 pr-10 text-sm outline-none transition"
              style={{ borderColor: COLORS.gray100 }}
            >
              <option>Biasa</option>
              <option>Penting</option>
              <option>Rahasia</option>
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>Perihal</label>
        <input
          value={form.perihal}
          onChange={set("perihal")}
          placeholder="Ringkasan isi surat"
          className="brand-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
          style={{ borderColor: touched && !form.perihal.trim() ? COLORS.error : COLORS.gray100 }}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>Berkas Scan Surat Asli</label>
        <FileDropzone file={file} onFile={setFile} />
        {touched && !file && <p className="mt-1.5 text-xs font-medium" style={{ color: COLORS.error }}>Berkas scan surat wajib diunggah untuk arsip kendali.</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="brand-btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:opacity-70 sm:w-auto sm:px-8"
      >
        {submitting ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Memproses...
          </>
        ) : (
          "Generate Disposisi 1 & 2"
        )}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------
   Signature pad
------------------------------------------------------------------- */
function SignaturePad({ hasSignature, setHasSignature }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.strokeStyle = COLORS.darkGray;
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const start = (e) => {
    drawingRef.current = true;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawingRef.current) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasSignature) setHasSignature(true);
  };
  const end = () => {
    drawingRef.current = false;
  };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border-2 border-dashed" style={{ borderColor: COLORS.gray200 }}>
        <canvas
          ref={canvasRef}
          width={460}
          height={150}
          className="w-full touch-none"
          style={{ backgroundColor: "#FAFBFC" }}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          {hasSignature ? "Tanda tangan tersimpan" : "Bubuhkan tanda tangan pada area di atas"}
        </p>
        <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: COLORS.primaryBlue }}>
          <Eraser size={13} /> Hapus
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Layar 3 — Ruang Kerja Rektor
------------------------------------------------------------------- */
function DocumentPreview({ letter }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: COLORS.gray100 }}>
        <p className="truncate text-xs font-semibold" style={{ color: COLORS.deepBlue }}>{letter.nomorSurat}.pdf</p>
        <div className="flex items-center gap-1">
          <button type="button" className="rounded-md p-1.5 hover:bg-gray-100" style={{ color: "#9CA3AF" }}><ZoomOut size={14} /></button>
          <button type="button" className="rounded-md p-1.5 hover:bg-gray-100" style={{ color: "#9CA3AF" }}><ZoomIn size={14} /></button>
          <span className="ml-1 text-xs" style={{ color: "#9CA3AF" }}>1 / 1</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#E9EDF2" }}>
        <div className="mx-auto max-w-md rounded-sm bg-white p-8 shadow-md">
          <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: COLORS.gray100 }}>
            <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.iceBlue }}>
              <Landmark size={20} style={{ color: COLORS.deepBlue }} />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight" style={{ color: COLORS.deepBlue }}>UNIVERSITAS NUSANTARA JAYA</p>
              <p className="leading-tight" style={{ color: "#9CA3AF", fontSize: "10px" }}>Jl. Pendidikan Raya No. 1, Surabaya</p>
            </div>
          </div>

          <div className="mt-5 space-y-1 text-xs" style={{ color: COLORS.darkGray }}>
            <p><span className="font-semibold">Nomor</span> : {letter.nomorSurat}</p>
            <p><span className="font-semibold">Sifat</span> : {letter.sifat}</p>
            <p><span className="font-semibold">Perihal</span> : {letter.perihal}</p>
            <p className="pt-2"><span className="font-semibold">Kepada Yth.</span></p>
            <p>Rektor Universitas Nusantara Jaya</p>
            <p>di Tempat</p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full" style={{ backgroundColor: COLORS.gray100 }} />
            <div className="h-2 w-full rounded-full" style={{ backgroundColor: COLORS.gray100 }} />
            <div className="h-2 w-4/5 rounded-full" style={{ backgroundColor: COLORS.gray100 }} />
            <div className="h-2 w-full rounded-full" style={{ backgroundColor: COLORS.gray100 }} />
            <div className="h-2 w-3/5 rounded-full" style={{ backgroundColor: COLORS.gray100 }} />
          </div>

          <p className="mt-5 text-xs" style={{ color: COLORS.darkGray }}>
            Demikian surat ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.
          </p>

          <div className="mt-8 text-right text-xs" style={{ color: COLORS.darkGray }}>
            <p>Hormat kami,</p>
            <p className="mt-10 font-semibold">{letter.pengirim}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RektorWorkspace({ letters, initialSelectedId, onSign, showToast }) {
  const pending = letters.filter((l) => l.status === "Menunggu Review Rektor");
  const [activeId, setActiveId] = useState(
    initialSelectedId && pending.some((l) => l.id === initialSelectedId) ? initialSelectedId : null
  );
  const [instruksi, setInstruksi] = useState("");
  const [hasSignature, setHasSignature] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [touched, setTouched] = useState(false);

  const letter = pending.find((l) => l.id === activeId);

  const doSign = (method) => {
    setTouched(true);
    if (!instruksi.trim()) return;
    if (method === "manual" && !hasSignature) return;
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
      onSign(letter.id, instruksi);
      showToast({ text: `Disposisi untuk ${letter.nomorSurat} berhasil ditandatangani.` });
    }, 1200);
  };

  const backToQueue = () => {
    setActiveId(null);
    setInstruksi("");
    setHasSignature(false);
    setSigned(false);
    setTouched(false);
  };

  if (!letter) {
    return (
      <div className="rounded-2xl border p-7" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
        <h3 className="text-base font-bold" style={{ color: COLORS.deepBlue }}>Antrean Surat Menunggu Tanda Tangan</h3>
        <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>Pilih surat untuk mulai meninjau dan memberikan instruksi disposisi.</p>

        {pending.length === 0 ? (
          <div className="mt-8 flex flex-col items-center py-12 text-center">
            <CheckCircle2 size={32} style={{ color: COLORS.success }} />
            <p className="mt-3 text-sm font-medium" style={{ color: COLORS.darkGray }}>Semua surat sudah ditinjau. Tidak ada antrean saat ini.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {pending.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveId(l.id)}
                className="row-hover flex w-full items-center justify-between rounded-xl border p-4 text-left"
                style={{ borderColor: COLORS.gray100 }}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" style={{ color: COLORS.darkGray }}>{l.perihal}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "#9CA3AF" }}>{l.nomorSurat} • {l.pengirim}</p>
                </div>
                <Badge status={l.status} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button onClick={backToQueue} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: COLORS.deepBlue }}>
        <ArrowLeft size={15} /> Kembali ke Antrean
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" style={{ minHeight: "560px" }}>
        <DocumentPreview letter={letter} />

        <div className="rounded-2xl border p-6" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
          {signed ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(39,174,96,0.12)" }}>
                <CheckCircle2 size={28} style={{ color: COLORS.success }} />
              </div>
              <h3 className="mt-4 text-base font-bold" style={{ color: COLORS.deepBlue }}>Disposisi Berhasil Ditandatangani</h3>
              <p className="mt-1 max-w-xs text-sm" style={{ color: "#9CA3AF" }}>
                Dokumen akan dikembalikan ke BAU untuk diverifikasi dan diteruskan ke fakultas terkait.
              </p>
              <button onClick={backToQueue} className="brand-btn-primary mt-6 rounded-xl px-6 py-2.5 text-sm font-bold">
                Pilih Surat Lain
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-base font-bold" style={{ color: COLORS.deepBlue }}>Lembar Disposisi 1</h3>
              <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>{letter.nomorSurat} — {letter.perihal}</p>

              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>Catatan / Instruksi Disposisi</label>
                <textarea
                  value={instruksi}
                  onChange={(e) => setInstruksi(e.target.value)}
                  rows={4}
                  placeholder="Contoh: Teruskan ke Dekan Fakultas Teknik untuk ditindaklanjuti."
                  className="brand-input w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none transition"
                  style={{ borderColor: touched && !instruksi.trim() ? COLORS.error : COLORS.gray100 }}
                />
                {touched && !instruksi.trim() && <p className="mt-1 text-xs font-medium" style={{ color: COLORS.error }}>Instruksi disposisi wajib diisi.</p>}
              </div>

              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-medium" style={{ color: COLORS.darkGray }}>Tanda Tangan Digital</label>
                <SignaturePad hasSignature={hasSignature} setHasSignature={setHasSignature} />
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  disabled={signing}
                  onClick={() => doSign("manual")}
                  className="brand-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold disabled:opacity-70"
                >
                  {signing ? <Loader2 size={16} className="animate-spin" /> : <PenTool size={15} />}
                  Konfirmasi Tanda Tangan
                </button>
                <button
                  type="button"
                  disabled={signing}
                  onClick={() => doSign("esign")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold disabled:opacity-70"
                  style={{ borderColor: COLORS.deepBlue, color: COLORS.deepBlue }}
                >
                  <FileSignature size={15} /> Gunakan E-Sign Terintegrasi
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Layar 4 — Penerimaan Dekan
------------------------------------------------------------------- */
function DekanReceiving({ letters, showToast }) {
  const ready = letters.filter((l) => l.status === "Closed");

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray100 }}>
      <div className="border-b p-6" style={{ borderColor: COLORS.gray100 }}>
        <h3 className="text-base font-bold" style={{ color: COLORS.deepBlue }}>Instruksi Kerja Diterima</h3>
        <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>Surat yang telah selesai didisposisi oleh Rektor dan diteruskan oleh BAU.</p>
      </div>

      {ready.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Inbox size={30} style={{ color: COLORS.gray200 }} />
          <p className="mt-3 text-sm font-medium" style={{ color: "#9CA3AF" }}>Belum ada instruksi kerja baru.</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: COLORS.gray100 }}>
          {ready.map((l) => (
            <div key={l.id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: COLORS.gray100 }}>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: COLORS.darkGray }}>{l.perihal}</p>
                <p className="mt-1 text-xs" style={{ color: "#9CA3AF" }}>{l.nomorSurat} • {l.pengirim} • {l.tanggalSurat} • {l.fakultasTujuan}</p>
              </div>
              <button
                onClick={() => showToast({ text: `Instruksi Kerja ${l.nomorSurat} berhasil diunduh (simulasi).` })}
                className="brand-btn-primary inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold"
              >
                <Download size={13} /> Unduh Instruksi Kerja
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Sidebar & Topbar
------------------------------------------------------------------- */
function Sidebar({ role, activeView, setActiveView, mobileOpen, setMobileOpen, onLogout }) {
  const items = NAV_ITEMS.filter((n) => n.roles.includes(role));
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" style={{ backgroundColor: "rgba(21,38,58,0.5)" }} onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: COLORS.deepBlue }}
      >
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <Landmark size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-white">SIM Disposisi</p>
            <p className="mt-1 text-xs leading-none text-white" style={{ opacity: 0.6 }}>Surat Masuk</p>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {items.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileOpen(false);
                }}
                className="nav-item flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition"
                style={{
                  backgroundColor: active ? COLORS.accentYellow : "transparent",
                  color: active ? COLORS.deepBlue : "rgba(255,255,255,0.8)",
                }}
              >
                <item.icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="rounded-xl p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: COLORS.accentYellow, color: COLORS.deepBlue }}>
              {ROLE_META[role].initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{ROLE_META[role].label}</p>
              <p className="text-xs text-white" style={{ opacity: 0.55 }}>Mode simulasi</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Keluar"
              title="Keluar"
              className="logout-btn shrink-0 rounded-lg p-1.5 text-white"
              style={{ opacity: 0.75 }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ role, setRole, title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-white px-5 py-4 sm:px-8" style={{ borderColor: COLORS.gray100 }}>
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-1.5 hover:bg-gray-100 lg:hidden" style={{ color: COLORS.darkGray }}>
          <LayoutDashboard size={20} />
        </button>
        <h1 className="text-base font-bold sm:text-lg" style={{ color: COLORS.deepBlue }}>{title}</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="hidden rounded-lg p-2 hover:bg-gray-100 sm:block" style={{ color: "#9CA3AF" }}>
          <Bell size={18} />
        </button>
        <div className="hidden h-6 w-px sm:block" style={{ backgroundColor: COLORS.gray100 }} />
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 font-semibold" style={{ color: "#9CA3AF", fontSize: "10px" }}>
            Simulasi Peran
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="brand-input appearance-none rounded-xl border py-2 pl-3.5 pr-9 text-sm font-semibold outline-none"
            style={{ borderColor: COLORS.gray100, color: COLORS.deepBlue }}
          >
            <option value="bau">BAU</option>
            <option value="rektor">Rektor</option>
            <option value="dekan">Dekan Fakultas</option>
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------
   Root component
------------------------------------------------------------------- */
const VIEW_TITLES = {
  dashboard: "Dashboard Utama",
  input: "Input Surat Masuk",
  workspace: "Ruang Kerja Disposisi",
  receiving: "Penerimaan Instruksi Kerja",
  archive: "Arsip Surat",
};

export default function DispositionDashboard({ onLogout } = {}) {
  const [role, setRoleState] = useState("bau");
  const [activeView, setActiveView] = useState("dashboard");
  const [letters, setLetters] = useState(INITIAL_LETTERS);
  const [selectedId, setSelectedId] = useState(INITIAL_LETTERS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingWorkspaceId, setPendingWorkspaceId] = useState(null);

  const showToast = useCallback((t) => {
    setToast(t);
    setTimeout(() => setToast(null), 4200);
  }, []);

  const setRole = (r) => {
    setRoleState(r);
    setActiveView("dashboard");
  };

  const handleTableAction = (id) => {
    if (role === "rektor") {
      setPendingWorkspaceId(id);
      setActiveView("workspace");
    } else if (role === "dekan") {
      const l = letters.find((x) => x.id === id);
      showToast({ text: `Instruksi Kerja ${l.nomorSurat} berhasil diunduh (simulasi).` });
    } else {
      setSelectedId(id);
    }
  };

  const handleGenerate = (data) => {
    setLetters((prev) => {
      const nextId = Math.max(...prev.map((l) => l.id)) + 1;
      return [
        { id: nextId, nomorSurat: data.nomorSurat, pengirim: data.pengirim, perihal: data.perihal, tanggalSurat: data.tanggalSurat, sifat: data.sifat, fakultasTujuan: "Belum Ditentukan", status: "Menunggu Review Rektor" },
        ...prev,
      ];
    });
    showToast({ text: "Lembar Disposisi 1 & 2 berhasil dibuat dan diteruskan ke Rektor." });
  };

  const handleSign = (id, instruksi) => {
    setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, status: "Selesai Ditandatangani Rektor", instruksi } : l)));
  };

  return (
    <div className="flex min-h-screen w-full font-sans" style={{ backgroundColor: COLORS.iceBlue }}>
      <style>{`
        .brand-input:focus {
          border-color: ${COLORS.primaryBlue} !important;
          box-shadow: 0 0 0 3px rgba(170,128,183,0.18);
          background-color: #FFFFFF !important;
        }
        .brand-btn-primary {
          background-color: ${COLORS.accentYellow};
          color: ${COLORS.deepBlue};
          transition: background-color .18s ease, transform .12s ease;
        }
        .brand-btn-primary:hover:not(:disabled) { background-color: #E6B93E; }
        .brand-btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .nav-item:hover { background-color: rgba(255,255,255,0.1); }
        .logout-btn:hover { background-color: rgba(255,255,255,0.15); opacity: 1 !important; }
        .row-hover:hover { background-color: ${COLORS.iceBlue}; }
        .action-btn:hover:not(:disabled) { filter: brightness(0.95); }
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .toast-in { animation: toastIn .28s ease both; }
      `}</style>

      <Toast toast={toast} onClose={() => setToast(null)} />

      <Sidebar role={role} activeView={activeView} setActiveView={setActiveView} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={onLogout} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar role={role} setRole={setRole} title={VIEW_TITLES[activeView]} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-5 sm:p-8">
          {activeView === "dashboard" && (
            <DashboardHome role={role} letters={letters} selectedId={selectedId} onSelect={setSelectedId} onAction={handleTableAction} />
          )}
          {activeView === "input" && role === "bau" && <InputSuratForm onGenerate={handleGenerate} />}
          {activeView === "workspace" && role === "rektor" && (
            <RektorWorkspace letters={letters} initialSelectedId={pendingWorkspaceId} onSign={handleSign} showToast={showToast} />
          )}
          {activeView === "receiving" && role === "dekan" && <DekanReceiving letters={letters} showToast={showToast} />}
          {activeView === "archive" && <ComingSoon label="Arsip Surat Kronologis" />}
        </main>
      </div>
    </div>
  );
}