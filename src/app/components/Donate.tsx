import Script from 'next/script';

export default function Donate() {
  return (
    <Script
      id="bmc-widget"
      strategy="afterInteractive"
      src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
      data-name="BMC-Widget"
      data-cfasync="false"
      data-id="kame777"
      data-description="Support me on Buy me a coffee!"
      data-message="個人開発ですので、支援して頂けると大変助かります！"
      data-color="#40DCA5"
      data-position="Right"
      data-x_margin="18"
      data-y_margin="18"
    />
  );
}