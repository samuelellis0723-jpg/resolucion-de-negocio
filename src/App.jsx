import { SiteFooter } from '@/components/layout/site-footer.jsx';
import { SiteHeader } from '@/components/layout/site-header.jsx';
import { Routing } from '@/routes/routing.jsx';

export default function App() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <Routing />
      </main>
      <SiteFooter />
    </div>
  );
}
