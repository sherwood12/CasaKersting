import React from 'react';

const news = [
  {
    date: '15.03.2024',
    title: 'Neue Kaffeemaschine',
    content:
      'Wir haben eine neue Kaffeemaschine installiert. Bitte lest euch die Bedienungsanleitung durch, die daneben liegt.',
  },
  {
    date: '01.03.2024',
    title: 'WLAN-Passwort aktualisiert',
    content:
      'Das WLAN-Passwort wurde aktualisiert. Ihr findet es im Willkommensordner.',
  },
  {
    date: '01.03.2024',
    title: 'WLAN-Passwort aktualisiert',
    content:
      'Das WLAN-Passwort wurde aktualisiert. Ihr findet es im Willkommensordner.',
  },
];

export function News() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Aktuelle Informationen</h3>
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{item.title}</h4>
              <span className="text-sm text-neutral-500">{item.date}</span>
            </div>
            <p className="text-neutral-600">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
