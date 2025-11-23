import '../../styles/global.css';

export const metadata = {
  title: 'Admin Panel',
  description: 'Halaman admin',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
