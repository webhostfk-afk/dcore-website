// The sticky frame of the header: opaque page colour on desktop, transparent under the mobile bar.
export default function HeaderShell({ children }: { children: React.ReactNode }) {
  return <header className="sticky top-0 z-[100] block bg-[#f0fafe] max-[1025px]:z-[15] max-[1025px]:bg-transparent">{children}</header>;
}
