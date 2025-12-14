import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-primary-800 to-primary-900 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Logo and About */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/logo.png"
                  alt="Instituto Estação"
                  className="h-16 w-auto"
                />
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    Instituto Estação
                  </h3>
                  <span className="text-primary-200 font-medium">
                    {t('home.footer.tagline')}
                  </span>
                </div>
              </div>
              <p className="text-primary-100 mb-6 max-w-md leading-relaxed">
                {t('home.footer.description')}
              </p>

            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-primary-100">{t('home.footer.quick_links')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/quem-somos" className="text-primary-200 hover:text-white transition-colors">
                    {t('header.about')}
                  </Link>
                </li>
                <li>
                  <Link to="/eventos" className="text-primary-200 hover:text-white transition-colors">
                    {t('header.events')}
                  </Link>
                </li>
                <li>
                  <Link to="/doacoes" className="text-primary-200 hover:text-white transition-colors">
                    {t('header.donations')}
                  </Link>
                </li>
                <li>
                  <Link to="/transparencia" className="text-primary-200 hover:text-white transition-colors">
                    {t('header.transparency')}
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="text-primary-200 hover:text-white transition-colors">
                    {t('header.contact')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-primary-100">{t('home.footer.contact')}</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-300 mt-0.5 flex-shrink-0" />
                  <div className="text-primary-200">
                    <p>Rua Rio Negro, Bela Vista</p>
                    <p>Boa Vista - Roraima</p>
                    <p className="text-sm text-primary-300 mt-2">{t('home.footer.office')}:</p>
                    <p>Rua Aracaju, 725, Novo Horizonte</p>
                    <p>Rorainópolis - Roraima</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-300 flex-shrink-0" />
                  <a href="tel:+5541987479813" className="text-primary-200 hover:text-white transition-colors">
                    +55 (41) 98747-9813
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-300 flex-shrink-0" />
                  <a href="mailto:institutoestacao100@gmail.com" className="text-primary-200 hover:text-white transition-colors">
                    institutoestacao100@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-primary-200">
              <Heart className="w-4 h-4 text-red-400" />
              <span>&copy; 2025 Instituto Estação. {t('home.footer.rights')}.</span>
            </div>
            <div className="text-primary-300 text-sm">
              <span>{t('home.footer.developed_by')} <a href="https://merakigroup.site" target="_blank" rel="noopener noreferrer" className="hover:text-primary-200 transition-colors">Meraki Group</a></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}