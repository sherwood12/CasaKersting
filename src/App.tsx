import React, { useState } from 'react';
import { BookingForm, type BookingData } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { Menu } from './components/Menu';
import { Home } from 'lucide-react';

function App() {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  const handleBookingSubmit = (bookingData: BookingData) => {
    setBookings([...bookings, bookingData]);
  };

  const handleDeleteBooking = (index: number) => {
    setBookings(bookings.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Unser Ferienhaus</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">
                Willkommen bei unserem kleinen Urlaubsplaner 🏡
              </h2>
              <p className="text-neutral-600">
                Diese Seite ist für uns – Familie, Freunde und Bekannte – damit wir die
                Wohnung einfach und stressfrei nutzen können. Trag dich einfach ein –
                ganz ohne WhatsApp-Chaos 😉
              </p>
            </div>

            <Menu />

            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <BookingForm onSubmit={handleBookingSubmit} existingBookings={bookings} />
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <BookingList bookings={bookings} onDelete={handleDeleteBooking} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;