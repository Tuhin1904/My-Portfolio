import { redirect } from 'next/navigation';

export default function LegacyUrlShortenerRedirect() {
  redirect('/tools/url-shortener');
}
