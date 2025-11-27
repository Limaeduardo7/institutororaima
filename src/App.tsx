import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import QuemSomos from './pages/QuemSomos';
import Eventos from './pages/Eventos';
import Doacoes from './pages/Doacoes';
import Transparencia from './pages/Transparencia';
import Documentos from './pages/Documentos';
import Contato from './pages/Contato';
import Localizacao from './pages/Localizacao';
import EventoDetalhes from './pages/EventoDetalhes';
import Admin from './pages/Admin';
import SocialActionsAdmin from './pages/admin/SocialActionsAdmin';
import EventsAdmin from './pages/admin/EventsAdmin';
import ContactMessagesAdmin from './pages/admin/ContactMessagesAdmin';
import DonationsAdmin from './pages/admin/DonationsAdmin';
import FinancialDocumentsAdmin from './pages/admin/FinancialDocumentsAdmin';
import AdminDocuments from './pages/admin/AdminDocuments';
import SettingsAdmin from './pages/admin/SettingsAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quem-somos" element={<QuemSomos />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="doacoes" element={<Doacoes />} />
          <Route path="transparencia" element={<Transparencia />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="contato" element={<Contato />} />
          <Route path="localizacao" element={<Localizacao />} />
          <Route path="evento/:id" element={<EventoDetalhes />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="social-actions" element={<SocialActionsAdmin />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="contact-messages" element={<ContactMessagesAdmin />} />
          <Route path="donations" element={<DonationsAdmin />} />
          <Route path="financial-documents" element={<FinancialDocumentsAdmin />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
