import { site } from "@/data/site";

export function FloatingBookingCTA() {
  return (
    <a
      href={site.contact.bookingWhatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contratar show por WhatsApp"
      className="fixed bottom-4 left-1/2 z-50 flex h-11 -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-orange-400/30 bg-black/70 px-4 text-sm font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] backdrop-blur-xl transition-all hover:scale-[1.02] hover:bg-black/80 hover:opacity-95 active:scale-[0.98] sm:px-5 md:left-auto md:right-6 md:translate-x-0"
    >
      <WhatsAppIcon className="h-4 w-4 text-orange-200" />
      <span>Contratar show</span>
    </a>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 0C5.402 0 .002 5.4 0 12.04c0 2.123.555 4.196 1.61 6.018L0 24l6.083-1.595a12.04 12.04 0 0 0 5.957 1.518h.005c6.638 0 12.038-5.4 12.04-12.04C24.085 5.4 18.683 0 12.04 0zm0 22.05h-.004a10.04 10.04 0 0 1-5.123-1.404l-.367-.218-3.609.946.965-3.519-.239-.379A10.022 10.022 0 0 1 2.022 12.04C2.022 6.504 6.503 2.022 12.04 2.022c2.681 0 5.2 1.045 7.097 2.943a9.974 9.974 0 0 1 2.94 7.097c-.002 5.537-4.483 10.019-10.04 10.019z" />
    </svg>
  );
}
