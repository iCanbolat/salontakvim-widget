# 🎨 SalonTakvim Widget - Frontend Roadmap

## 📋 Proje Genel Bakış

**Amaç**: Amelia benzeri modern, step-by-step (adım adım) randevu widget'ı geliştirmek. Widget hem iframe ile embed edilebilir, hem de WordPress/diğer platformlarda shortcode ile kullanılabilir olmalı.

**Teknoloji Stack**:

- ⚛️ React 19.1.1
- 🎨 TailwindCSS 4.1.16
- 🏗️ Vite 7.1.7
- 📦 TypeScript 5.9.3
- 🎯 Radix UI (UI Components)
- 🎨 Lucide React (Icons)
- 🔄 Class Variance Authority (Styling)

**Hedef Tasarım**: https://wpamelia.com/step-by-step-booking-form-2-0

**Genel İlerleme**: ~90% (Faz 1, 2, 3, 4, 5 ve 7 Tamamlandı - Payment atlandı)

---

## 🎯 Ana Özellikler ve Gereksinimler

### ✅ Backend API Entegrasyonu (Mevcut)

Backend'de hazır olan 9 endpoint:

**Admin Endpoints** (Widget ayarları için):

1. `GET /stores/:storeId/widget-settings` - Widget ayarlarını getir
2. `PATCH /stores/:storeId/widget-settings` - Widget ayarlarını güncelle
3. `POST /stores/:storeId/widget-settings/regenerate-key` - Widget key yenile
4. `GET /stores/:storeId/widget-settings/embed-code` - Embed kodu al

**Public Endpoints** (Widget'ın kullanacağı): 5. `GET /public/widget/:widgetKey/config` - Widget konfigürasyonu 6. `GET /public/widget/:widgetKey/services` - Hizmetler listesi 7. `GET /public/widget/:widgetKey/locations` - Lokasyonlar listesi 8. `GET /public/widget/:widgetKey/staff` - Personel listesi 9. `GET /public/widget/:widgetKey/availability` - Müsait saatler

### 🎨 Tasarım Özellikleri

#### Layout Modları (2 Adet)

1. **List Layout** (Varsayılan)

   - Tek sayfa görünümü
   - Tüm seçimler (Hizmet, Personel, Lokasyon) ilk adımda
   - Yan tarafta özet sidebar
   - Amelia'nın standart görünümü

2. **Steps Layout** (Wizard)
   - Çok adımlı form wizard'ı
   - Her adım ayrı ekran
   - İleriye/geriye navigasyon
   - Progress bar ile ilerleme göstergesi

#### Adımlar (7 Adet)

1. **Service Selection** (Hizmet Seçimi)

   - Kategorilere göre gruplandırılmış hizmetler
   - Hover'da sağda hizmet detayları
   - Arama özelliği
   - Fiyat ve süre bilgisi
   - Kategori başına hizmet sayısı

2. **Employee Selection** (Personel Seçimi) - Opsiyonel

   - Personel listesi (avatar, isim, ünvan)
   - "Any Employee" seçeneği
   - Seçilen hizmete göre filtreleme
   - Personel müsaitlik durumu

3. **Location Selection** (Lokasyon Seçimi) - Opsiyonel

   - Lokasyon listesi (adres, telefon, email)
   - "Any Location" seçeneği
   - Harita entegrasyonu (opsiyonel)
   - Seçilen hizmet/personele göre filtreleme

4. **Extras Selection** (Ekstra Seçimi) - Varsa

   - Hizmete ait ekstralar
   - Miktar seçimi
   - Fiyat hesaplama
   - Toplam fiyat güncellemesi

5. **Date & Time Selection** (Tarih ve Saat Seçimi)

   - Takvim görünümü
   - Müsait saat slotları
   - 15 dakikalık aralıklar
   - Recurring (tekrarlayan) randevu seçeneği
   - "Bringing anyone with you" seçeneği

6. **Customer Info** (Müşteri Bilgileri)

   - Ad, Soyad, Email, Telefon
   - Custom fields (hizmete özel alanlar)
   - Form validasyonu
   - Misafir veya kayıtlı kullanıcı

7. **Payment** (Ödeme)

   - Ödeme yöntemi seçimi
   - Kupon kodu girişi
   - Toplam fiyat özeti
   - Ödeme provider entegrasyonu hazırlığı

8. **Confirmation** (Onay)
   - Randevu detayları
   - Takvime ekleme butonları (Google, Outlook, Apple, Yahoo)
   - Müşteri paneli linki
   - Finish butonu (yönlendirme)

#### Sidebar Özellikleri

- Adım listesi ve ilerleme
- Seçilen bilgilerin özeti
  - Hizmet adı ve fiyat
  - Personel adı (varsa)
  - Lokasyon (varsa)
  - Tarih ve saat
  - Toplam fiyat
- Şirket email (tıklanabilir)
- Responsive (mobilde üstte)

#### Özelleştirme Seçenekleri (Backend'den gelen)

**Renkler** (11 adet):

- Primary Color
- Secondary Color
- Sidebar Background Color
- Content Background Color
- Text Color
- Heading Color

**Tipografi**:

- Font Family (Google Fonts)
- Font Size (base size)

**Buton**:

- Border Radius

**Ayarlar**:

- Progress Bar göster/gizle
- Misafir randevu izni
- Redirect URL (randevu sonrası)

**Alan Gereksinimleri**:

- Employee zorunlu mu?
- Location zorunlu mu?
- Last Name zorunlu mu?
- Email zorunlu mu?
- Phone zorunlu mu?

**Menü Öğeleri** (Sidebar'da gösterilecekler):

- Service
- Employee
- Location
- Extras
- Date & Time
- Customer Info
- Payment

---

## 📂 Proje Yapısı

```
widget/
├── public/
│   └── widget-loader.js          # Widget yükleme script'i (embed için)
├── src/
│   ├── main.tsx                   # Ana entry point
│   ├── App.tsx                    # Ana widget container
│   ├── index.css                  # Global styles
│   ├── types/
│   │   ├── widget.types.ts        # Widget konfigürasyon tipleri
│   │   ├── api.types.ts           # API response tipleri
│   │   └── appointment.types.ts   # Randevu tipleri
│   ├── contexts/
│   │   ├── WidgetContext.tsx      # Widget global state
│   │   ├── BookingContext.tsx     # Randevu state management
│   │   └── ThemeContext.tsx       # Tema ve stil yönetimi
│   ├── hooks/
│   │   ├── useWidgetConfig.ts     # Widget config hook
│   │   ├── useBookingFlow.ts      # Randevu akışı hook
│   │   ├── useAvailability.ts     # Müsaitlik kontrolü hook
│   │   └── useApi.ts              # API calls hook
│   ├── services/
│   │   ├── api.service.ts         # API client
│   │   ├── storage.service.ts     # LocalStorage yönetimi
│   │   └── validation.service.ts  # Form validasyonları
│   ├── components/
│   │   ├── layout/
│   │   │   ├── WidgetContainer.tsx      # Ana container
│   │   │   ├── ListLayout.tsx           # List layout wrapper
│   │   │   ├── StepsLayout.tsx          # Steps layout wrapper
│   │   │   ├── Sidebar.tsx              # Sidebar component
│   │   │   ├── ProgressBar.tsx          # İlerleme çubuğu
│   │   │   └── MobileHeader.tsx         # Mobil header
│   │   ├── steps/
│   │   │   ├── ServiceSelection/
│   │   │   │   ├── index.tsx              # Ana component
│   │   │   │   ├── CategoryList.tsx       # Kategori listesi
│   │   │   │   ├── ServiceList.tsx        # Hizmet listesi
│   │   │   │   ├── ServiceCard.tsx        # Hizmet kartı
│   │   │   │   ├── ServiceSearch.tsx      # Arama
│   │   │   │   └── PackageOffer.tsx       # Paket teklifi (gelecek)
│   │   │   ├── EmployeeSelection/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── EmployeeCard.tsx
│   │   │   │   ├── EmployeeList.tsx
│   │   │   │   └── AnyEmployeeOption.tsx
│   │   │   ├── LocationSelection/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── LocationCard.tsx
│   │   │   │   ├── LocationList.tsx
│   │   │   │   └── AnyLocationOption.tsx
│   │   │   ├── ExtrasSelection/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── ExtraCard.tsx
│   │   │   │   └── ExtrasList.tsx
│   │   │   ├── DateTimeSelection/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── Calendar.tsx
│   │   │   │   ├── TimeSlots.tsx
│   │   │   │   ├── RecurringModal.tsx
│   │   │   │   └── BringingAnyoneOption.tsx
│   │   │   ├── CustomerInfo/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── PersonalInfoForm.tsx
│   │   │   │   └── CustomFields.tsx
│   │   │   ├── Payment/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── PaymentMethods.tsx
│   │   │   │   ├── CouponInput.tsx
│   │   │   │   └── PriceSummary.tsx
│   │   │   └── Confirmation/
│   │   │       ├── index.tsx
│   │   │       ├── AppointmentDetails.tsx
│   │   │       ├── CalendarButtons.tsx
│   │   │       └── FinishButton.tsx
│   │   ├── ui/
│   │   │   ├── button.tsx              # Shadcn button
│   │   │   ├── input.tsx               # Shadcn input
│   │   │   ├── select.tsx              # Shadcn select
│   │   │   ├── calendar.tsx            # Shadcn calendar
│   │   │   ├── card.tsx                # Shadcn card
│   │   │   ├── badge.tsx               # Shadcn badge
│   │   │   ├── dialog.tsx              # Shadcn dialog
│   │   │   ├── dropdown-menu.tsx       # Shadcn dropdown
│   │   │   ├── separator.tsx           # Shadcn separator
│   │   │   ├── skeleton.tsx            # Shadcn skeleton
│   │   │   └── toast.tsx               # Shadcn toast
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── FormField.tsx
│   ├── utils/
│   │   ├── date.utils.ts              # Tarih işlemleri
│   │   ├── price.utils.ts             # Fiyat formatlama
│   │   ├── validation.utils.ts        # Validasyon fonksiyonları
│   │   └── theme.utils.ts             # Tema uygulaması
│   └── lib/
│       └── utils.ts                   # Genel utility fonksiyonları
├── vite.config.ts                     # Vite config (build için)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── components.json                    # Shadcn config
└── ROADMAP.md                         # Bu dosya
```

---

## 🚀 Geliştirme Aşamaları

### Faz 1: Temel Altyapı (1 Hafta) - Priority: CRITICAL ✅ TAMAMLANDI

#### 1.1 Proje Kurulumu ve Konfigürasyon ✅

- [x] Vite + React + TypeScript kurulumu (MEVCUT)
- [x] TailwindCSS konfigürasyonu (MEVCUT)
- [x] Shadcn/ui component library kurulumu (MEVCUT)
- [x] ESLint ve Prettier konfigürasyonu
- [x] Path aliasing (@/ imports) testi

#### 1.2 Type Definitions (Tip Tanımlamaları) ✅

- [x] `types/widget.types.ts` - Widget config interface'leri
  - WidgetConfig
  - ThemeConfig
  - LayoutType
  - SidebarMenuItems
  - FieldRequirements
- [x] `types/api.types.ts` - API response tipleri
  - ApiResponse generic type
  - ServiceResponse
  - StaffResponse
  - LocationResponse
  - AvailabilityResponse
- [x] `types/appointment.types.ts` - Randevu tipleri
  - AppointmentState
  - BookingStep
  - CustomerInfo
  - SelectedService
  - SelectedStaff
  - SelectedDateTime
- [x] `types/index.ts` - Barrel export

#### 1.3 API Service Layer ✅

- [x] `services/api.service.ts` - HTTP client
  - Base URL configuration
  - Widget key header injection
  - Error handling
  - Response interceptors
  - Retry logic
- [x] API methods:
  - `getWidgetConfig(widgetKey)`
  - `getServices(widgetKey)`
  - `getStaff(widgetKey)`
  - `getLocations(widgetKey)`
  - `getAvailability(widgetKey, params)`
  - `createAppointment(widgetKey, data)`
- [x] `services/storage.service.ts` - LocalStorage yönetimi
- [x] `services/validation.service.ts` - Form validasyonları
- [x] `services/index.ts` - Barrel export

#### 1.4 Context Setup ✅

- [x] `contexts/WidgetContext.tsx`
  - Widget config state
  - Loading state
  - Error state
  - Fetch config on init
- [x] `contexts/BookingContext.tsx`
  - Current step management
  - Selected values (service, staff, location, date, time)
  - Form validation state
  - Step navigation functions
- [x] `contexts/ThemeContext.tsx`
  - Apply CSS variables from config
  - Dynamic color injection
  - Font family application
- [x] `contexts/index.ts` - Barrel export

#### 1.5 Custom Hooks ✅

- [x] `hooks/useWidgetConfig.ts` - Widget config erişimi
- [x] `hooks/useBookingFlow.ts` - Booking flow navigation
- [x] `hooks/useAvailability.ts` - Availability fetching
- [x] `hooks/useApi.ts` - Generic API hook + specialized hooks

---

### Faz 2: UI Component Library (1 Hafta) - Priority: HIGH ✅ TAMAMLANDI

#### 2.1 Shadcn UI Components Kurulumu ✅

- [x] Button component
- [x] Input component
- [x] Select/Dropdown component
- [x] Calendar component
- [x] Card component
- [x] Badge component
- [x] Dialog/Modal component
- [x] Dropdown-menu component
- [x] Separator component
- [x] Skeleton (loading) component
- [x] Sheet component

#### 2.2 Shared Components ✅

- [x] `LoadingSpinner.tsx` - Yükleniyor animasyonu + LoadingOverlay
- [x] `ErrorBoundary.tsx` - Hata yakalama (React.Component)
- [x] `EmptyState.tsx` - Boş durum gösterimi
- [x] `FormField.tsx` - Form input wrapper

#### 2.3 Layout Components ✅

- [x] `WidgetContainer.tsx` - Ana container (max-width, padding, responsive)
- [x] `Sidebar.tsx` - Yan menü (özet gösterimi)
  - Step list with icons
  - Selected items summary
  - Completed steps with check icons
- [x] `ProgressBar.tsx` - İlerleme çubuğu (adım sayısı/toplam)
- [x] `MobileHeader.tsx` - Mobil için üst başlık (hamburger menu + sheet)

---

### Faz 3: List Layout Implementation (2 Hafta) - Priority: HIGH ⏳ DEVAM EDİYOR

#### 3.1 Service Selection Step ✅

- [x] `ServiceSelection/index.tsx` - Ana component
- [x] `CategoryList.tsx` - Solda kategori listesi
  - Kategori isimleri
  - Her kategoride kaç hizmet olduğu (badge)
  - Hover efekti
  - Seçili kategori vurgusu
- [x] `ServiceList.tsx` - Sağda hizmet listesi
  - Kategori seçilince hizmetler görünsün
  - Grid layout (responsive)
- [x] `ServiceCard.tsx` - Hizmet kartı
  - Hizmet adı
  - Açıklama (kısaltılmış)
  - Fiyat (currency formatında)
  - Süre (e.g., "30 min")
  - Seçim butonu
- [x] `ServiceSearch.tsx` - Arama input'u
  - Debounce search (300ms)
  - Clear button
  - Kategori ve hizmet ara

**Özellikler:**

- ✅ Seçilen hizmet sidebar'a eklensin (context'te)
- ✅ X butonu ile seçimi temizleme (context'te)
- ✅ Seçim sonrası "Category / Service Name" formatı
- ⏳ Package offer (gelecek özellik için hazırlık)

#### 3.2 Employee Selection Step ✅

- [x] `EmployeeSelection/index.tsx`
- [x] `EmployeeList.tsx` - Personel listesi
- [x] `EmployeeCard.tsx` - Personel kartı
  - Avatar (resim yoksa placeholder)
  - Ad Soyad
  - Ünvan/Title
  - Select button
- [x] `AnyEmployeeOption.tsx` - "Any Employee" seçeneği
  - Checkbox veya radio button
  - İlk sırada göster

**Özellikler:**

- ✅ Seçilen hizmete göre filtreleme (API'den)
- ⏳ Location seçiliyse ona göre filtreleme
- ✅ Sidebar'a eklensin (context'te)
- ✅ X butonu ile temizleme (context'te)

#### 3.3 Location Selection Step ✅

- [x] `LocationSelection/index.tsx`
- [x] `LocationList.tsx`
- [x] `LocationCard.tsx`
  - Lokasyon adı
  - Adres
  - Telefon
  - Email (tıklanabilir)
  - Select button
- [x] `AnyLocationOption.tsx`

**Özellikler:**

- ⏳ Service ve Staff'a göre filtreleme (API'den)
- ✅ Sidebar'a eklensin (context'te)
- ✅ X butonu ile temizleme (context'te)

#### 3.4 Extras Selection Step ✅

- [x] `ExtrasSelection/index.tsx`
- [x] `ExtrasList.tsx`
- [x] `ExtraCard.tsx`
  - Extra adı
  - Açıklama
  - Fiyat
  - Süre eklentisi (varsa)
  - Quantity selector (max'a kadar)

**Özellikler:**

- ✅ Multi-select (checkbox)
- ✅ Quantity için +/- butonları
- ✅ Toplam fiyat hesaplama ve sidebar'da gösterme
- ✅ Max quantity kontrolü

#### 3.5 Date & Time Selection Step ✅

- [x] `DateTimeSelection/index.tsx`
- [x] `Calendar.tsx` - Takvim komponenti (Shadcn Calendar kullanıldı)
  - Geçmiş tarihler disabled
  - Seçili tarih vurgusu
- [x] `TimeSlots.tsx` - Saat slotları
  - Grid layout
  - Dolu slotlar disabled
  - Hover ve seçili efekti
- [ ] `RecurringModal.tsx` - Tekrarlayan randevu popup'ı (gelecek özellik)
- [x] `BringingAnyoneOption.tsx`
  - Number input (+/- butonları)
  - Max capacity kontrolü

**Özellikler:**

- ✅ Availability API hook entegrasyonu
- ✅ Slot tıklanınca context'e kaydedilsin
- ⏳ Recurring modal (gelecek)
- ✅ Capacity > 1 ise "Bringing anyone" göster

#### 3.6 Customer Info Step ✅

- [x] `CustomerInfo/index.tsx`
- [x] `PersonalInfoForm.tsx`
  - First Name (required)
  - Last Name (config'e göre required)
  - Email (config'e göre required, validation)
  - Phone (config'e göre required, format validation)
  - Notes (opsiyonel)
  - Form validation
  - Error messages
- [ ] `CustomFields.tsx` - Hizmete özel alanlar (gelecek özellik)

**Özellikler:**

- ✅ Real-time validation
- ✅ Error highlighting
- ✅ Required field kontrolü (config'e göre)
- ✅ Email/phone format validation (validationService)
- ✅ Auto-save to context

#### 3.7 Payment Step ⏸️ ATLANDI

**Not**: Kullanıcı talebi üzerine payment step'i şimdilik atlandı. MVP'de confirmation'a direkt geçiliyor.

- [ ] `Payment/index.tsx` (Gelecek versiyonda eklenecek)
- [ ] `PaymentMethods.tsx`
- [ ] `CouponInput.tsx`
- [ ] `PriceSummary.tsx`

#### 3.8 Confirmation Step ✅

- [x] `Confirmation/index.tsx`
- [x] `AppointmentDetails.tsx` - Randevu detayları
  - Service name, price, duration
  - Extras (varsa)
  - Staff name
  - Location
  - Date & time
  - Customer info
  - Total price (currency formatted)
- [ ] `CalendarButtons.tsx` - Takvime ekle (gelecek özellik)
- [x] Finish butonu ve redirect logic

**Özellikler:**

- ✅ Success state gösterimi (CheckCircle icon)
- ✅ Appointment ID gösterimi
- ✅ Complete appointment details
- ✅ API call integration (createAppointment)
- ✅ Error handling
- ✅ "Book Another Appointment" butonu
- ✅ Redirect URL support (config'den)
- ⏳ Calendar export buttons (gelecek)

---

### Faz 4: Steps Layout Implementation (1.5 Hafta) - Priority: MEDIUM ✅ TAMAMLANDI

#### 4.1 Steps Layout Wrapper ✅

- [x] `StepsLayout.tsx` - Steps layout container
  - One step per screen
  - Back/Next navigation
  - Progress indicator with percentage
  - Step validation before next

#### 4.2 Step Components Adaptasyonu ✅

- [x] All steps work with StepsLayout (no changes needed)
  - Service selection
  - Employee selection
  - Location selection
  - Extras selection
  - Date & Time
  - Customer Info
  - Confirmation

**Özellikler:**

- ✅ Tek adım tek ekran
- ✅ İleriye giderken validasyon (canGoNext)
- ✅ Geriye gidebilme (canGoPrev)
- ✅ Progress bar güncellemesi
- ✅ Sidebar gösterimi (desktop'ta solda)
- ✅ Mobile responsive (sidebar collapse)

---

### Faz 5: Build & Embed Sistemi (1 Hafta) - Priority: HIGH ✅ TAMAMLANDI

#### 5.1 Vite Build Configuration ✅

- [x] `vite.config.ts` düzenlemesi
  - Build optimization (code splitting, minification)
  - Manual chunks (react, ui, date vendors)
  - Asset organization (images, fonts, js)
  - Development/production modes
  - Type checking integration
- [x] Build script'leri
  - `build` - Standard build
  - `build:prod` - Production with optimizations
  - `build:dev` - Development with sourcemaps
  - `type-check` - TypeScript validation

**Output:**

```
dist/
├── assets/
│   ├── js/
│   │   ├── react-vendor-[hash].js
│   │   ├── ui-vendor-[hash].js
│   │   ├── date-vendor-[hash].js
│   │   └── index-[hash].js
│   ├── images/[name]-[hash].*
│   └── fonts/[name]-[hash].*
├── index.html
└── (widget-loader.js will be copied)
```

#### 5.2 Embed Loader Script ✅

- [x] `public/widget-loader.js` - Widget yükleme script'i
  - Read data-widget-key attribute
  - Create iframe or inline mount
  - Inject CSS dynamically
  - Handle responsive sizing
  - Message passing (iframe height updates)
  - Loading & error states
  - Data-config JSON parsing

**Kullanım (Iframe):**

```html
<script
  src="https://cdn.salontakvim.com/widget-loader.js"
  data-widget-key="wk_abc123"
  data-mode="iframe"
></script>
```

**Kullanım (Inline):**

```html
<div id="salontakvim-widget"></div>
<script
  src="https://cdn.salontakvim.com/widget-loader.js"
  data-widget-key="wk_abc123"
  data-mode="inline"
  data-container="#salontakvim-widget"
></script>
```

**Advanced Configuration:**

```html
<script
  src="https://cdn.salontakvim.com/widget-loader.js"
  data-widget-key="wk_abc123"
  data-config='{"preselectedService": 5, "language": "tr"}'
></script>
```

#### 5.3 Environment Variables ✅

- [x] `.env.development` - Local development settings
- [x] `.env.production` - Production build settings
- [x] `.env.example` - Environment template
- [x] Variables:
  - `VITE_API_BASE_URL` - API endpoint
  - `VITE_WIDGET_VERSION` - Widget version
  - `VITE_CDN_URL` - CDN base URL
  - `VITE_ENV` - Environment name

#### 5.4 Documentation ✅

- [x] `EMBED.md` - Comprehensive embed guide

  - 3 integration methods (inline, iframe, React)
  - Configuration options
  - WordPress integration
  - Styling & customization
  - Events & callbacks
  - Performance tips
  - Browser support
  - Troubleshooting

- [x] `BUILD.md` - Build & deployment guide
  - Development workflow
  - Build commands
  - CDN deployment
  - Version management
  - Environment variables
  - CI/CD examples
  - Performance optimization
  - Security (CSP, CORS)
  - Testing production build

#### 5.5 WordPress Shortcode Hazırlığı ⏳

- [ ] WordPress plugin boilerplate (ayrı repo - gelecek)
- [ ] Shortcode handler
  - `[salontakvim key="wk_abc123"]`
  - `[salontakvim key="wk_abc123" mode="inline"]`
  - `[salontakvim key="wk_abc123" service="5"]`
- [ ] Admin settings sayfası (WP admin)
  - Widget key girişi
  - Önizleme
  - Embed code kopyalama

---

### Faz 6: State Management & API Integration (1 Hafta) - Priority: HIGH ✅ TAMAMLANDI

#### 6.1 BookingContext State Machine ✅

- [x] Initial state tanımlama
- [x] Step navigation functions
  - `goToStep(step)`
  - `nextStep()`
  - `prevStep()`
  - `canGoNext()` - Validasyon kontrolü
- [x] Selection state management
  - `selectService(service)`
  - `selectStaff(staff)`
  - `selectLocation(location)`
  - `selectDateTime(date, time)`
  - `updateCustomerInfo(info)`
- [x] Validation state
  - `validateStep(step)`
  - `validateForm()`

#### 6.2 API Calls & Error Handling ✅

- [x] Config loading on mount
- [x] Services fetching
- [x] Staff fetching (service'e göre filtreleme)
- [x] Locations fetching
- [x] Availability fetching (debounce ile)
- [x] Appointment creation
- [x] Error handling
  - Network errors
  - API errors (4xx, 5xx)
  - Validation errors
  - Retry logic
- [x] Loading states
  - Global loading
  - Per-step loading
  - Skeleton screens (ServiceSkeleton, StaffSkeleton, LocationSkeleton)

#### 6.3 Local Storage (Taslak Kaydetme) ✅

- [x] `services/storage.service.ts`
- [x] Save draft on each step (auto-save with 1s debounce)
- [x] Restore draft on reload (useEffect on mount)
- [x] Clear draft on completion (when appointment confirmed)
- [x] Expiry time (24 saat)

---

### Faz 7: Styling & Theming (1 Hafta) - Priority: MEDIUM ✅ TAMAMLANDI

#### 7.1 Dynamic Theme Application ✅

- [x] `utils/theme.utils.ts` - Theme utilities
  - applyTheme - CSS variables injection
  - applyTypography - Font family & size
  - applyButtonStyles - Border radius
  - loadGoogleFont - Dynamic font loading
  - hexToHSL - Color conversion
  - generateColorShades - Color palette generation
  - resetTheme - Reset to defaults
- [x] ThemeContext updated with theme utils
- [x] CSS variables:
  - `--primary` (primary color)
  - `--secondary` (secondary color)
  - `--sidebar-bg` (sidebar background)
  - `--content-bg` (content background)
  - `--foreground` (text color)
  - `--heading` (heading color)
  - `--font-family` (typography)
  - `--base-font-size` (typography)
  - `--radius` (button border radius)

#### 7.2 Responsive Design ✅

- [x] Desktop (>1024px) - Sidebar solda, content sağda
- [x] Tablet (768px - 1024px) - Responsive adjustments
- [x] Mobile (<768px) - Sidebar collapse, touch-friendly
- [x] TailwindCSS responsive utilities kullanımı

#### 7.3 Animasyonlar ✅

- [x] Animation utilities (stepTransition, fadeIn, slideUp, scaleIn)
- [x] Stagger children animations
- [x] Card hover efektleri (mevcut)
- [x] Button states (mevcut)
- [x] Loading animations (LoadingSpinner)
- [x] Success animation (confirmation CheckCircle)
- [ ] Framer Motion integration (opsiyonel - gelecek)

#### 7.4 Accessibility (A11y) ✅

- [x] Keyboard navigation hooks (useKeyboardNavigation, useFocusManagement)
- [x] ACCESSIBILITY.md documentation
- [x] Semantic HTML structure
- [x] ARIA labels (comprehensive guide)
- [ ] Screen reader testing (gelecek)
- [ ] Color contrast validation (gelecek)
- [ ] Focus indicators (TailwindCSS defaults kullanılıyor)

---

### Faz 8: Testing (1 Hafta) - Priority: MEDIUM

#### 8.1 Unit Tests

- [ ] Utility functions testleri
  - Date utils
  - Price utils
  - Validation utils
  - Theme utils
- [ ] Service layer testleri
  - API service mock
  - Storage service

#### 8.2 Component Tests (React Testing Library)

- [ ] Button component
- [ ] Input component
- [ ] ServiceCard component
- [ ] EmployeeCard component
- [ ] Calendar component
- [ ] TimeSlots component

#### 8.3 Integration Tests

- [ ] Full booking flow test
- [ ] API error handling test
- [ ] Validation flow test
- [ ] Theme application test

#### 8.4 E2E Tests (Playwright - Opsiyonel)

- [ ] Complete booking flow
- [ ] Error scenarios
- [ ] Responsive testing

---

### Faz 9: Optimizasyon & Performance (0.5 Hafta) - Priority: LOW

#### 9.1 Performance

- [ ] Code splitting (lazy loading)
- [ ] Image optimization
- [ ] Bundle size optimization
- [ ] Tree shaking verification
- [ ] Gzip compression

#### 9.2 Caching

- [ ] API response caching (React Query veya SWR)
- [ ] Service worker (opsiyonel)
- [ ] Static asset caching

#### 9.3 SEO & Meta Tags

- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Meta description
- [ ] Favicon

---

### Faz 10: Documentation & Deployment (0.5 Hafta) - Priority: MEDIUM

#### 10.1 Documentation

- [ ] README.md
  - Kurulum talimatları
  - Build talimatları
  - Embed kullanımı
  - WordPress shortcode kullanımı
- [ ] CHANGELOG.md
- [ ] API documentation
- [ ] Component documentation (Storybook - opsiyonel)

#### 10.2 Deployment

- [ ] CDN setup (CloudFlare, Vercel, AWS S3)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Versioning strategy
- [ ] Rollback plan

---

## 📋 Geliştirme Sırası (Öncelik)

### Sprint 1 (Hafta 1-2) - Foundation & UI Components ✅ TAMAMLANDI

1. ✅ Type definitions (4 saat)
2. ✅ API service layer (6 saat)
3. ✅ Context setup (6 saat)
4. ✅ Custom hooks (4 saat)
5. ✅ Shadcn UI kurulumu (4 saat)
6. ✅ Shared components (4 saat)
7. ✅ Layout components (6 saat)

### Sprint 2 (Hafta 2) - Service & Employee Selection

1. ✅ Service Selection step (12 saat)
2. ✅ Employee Selection step (8 saat)
3. ✅ Location Selection step (8 saat)
4. ✅ Sidebar implementation (4 saat)

### Sprint 3 (Hafta 3) - Date & Extras ✅ TAMAMLANDI

1. ✅ Date & Time Selection (12 saat)
2. ✅ Extras Selection (8 saat)
3. ✅ Progress bar (4 saat)
4. ✅ Navigation logic (4 saat)

### Sprint 4 (Hafta 4) - Customer & Confirmation ✅ TAMAMLANDI

1. ✅ Customer Info step (8 saat)
2. ⏸️ Payment step (ATLANDI - gelecek versiyon)
3. ✅ Confirmation step (6 saat)
4. ✅ Appointment creation API (4 saat)

### Sprint 5 (Hafta 5) - Steps Layout ✅ TAMAMLANDI

1. ✅ Steps Layout wrapper (6 saat)
2. ✅ ListLayout wrapper (2 saat)
3. ✅ BookingWidget router (4 saat)
4. ✅ App.tsx integration (2 saat)
5. ✅ Layout barrel exports (2 saat)

### Sprint 6 (Hafta 6) - Build & Embed ✅ TAMAMLANDI

1. ✅ Vite build config (4 saat)
2. ✅ Embed loader script (8 saat)
3. ✅ Environment variables (.env files) (2 saat)
4. ✅ Documentation (EMBED.md, BUILD.md) (6 saat)
5. ⏳ WordPress plugin boilerplate (gelecek)

### Sprint 7 (Hafta 7) - Theme & Styling ✅ TAMAMLANDI

1. ✅ Theme utils (theme.utils.ts) (4 saat)
2. ✅ ThemeContext integration (2 saat)
3. ✅ CSS variables system (2 saat)
4. ✅ Google Fonts loading (2 saat)
5. ✅ Responsive design validation (2 saat)

### Sprint 8 (Hafta 8) - Deployment

1. ✅ Documentation (8 saat)
2. ✅ CDN setup (4 saat)
3. ✅ CI/CD (6 saat)
4. ✅ Final testing (6 saat)

---

## 🎨 Tasarım Referansları

### Amelia Widget Özellikleri (Kopyalanacaklar)

1. **Layout**

   - Sol tarafta sidebar (özet ve adımlar)
   - Sağ tarafta content (form)
   - Beyaz arka plan, gölgeli kartlar
   - Rounded corners (8px)

2. **Service Selection**

   - Sol tarafta kategori listesi (sayılarla)
   - Sağda hover ile hizmet listesi
   - Kategori/Hizmet adı formatı
   - X butonu ile temizleme

3. **Dropdown Behavior**

   - Click to open
   - Search inside dropdown
   - Clear button (X)
   - Selected state

4. **Colors**

   - Primary: Mavi (#1A84EE benzeri)
   - Sidebar: Açık gri (#F5F7FA)
   - Text: Koyu gri (#2C3E50)
   - Success: Yeşil
   - Error: Kırmızı

5. **Typography**

   - Font: Inter, sans-serif
   - Headings: 18-20px, bold
   - Body: 14-16px, regular
   - Small: 12-14px, regular

6. **Buttons**

   - Primary: Dolgu mavi, beyaz text
   - Secondary: Border mavi, mavi text
   - Ghost: Sadece text
   - Border radius: 8px
   - Padding: 12px 24px

7. **Cards**

   - Beyaz arka plan
   - Border: 1px solid #E5E7EB
   - Border radius: 8px
   - Padding: 16px
   - Hover: Shadow artışı

8. **Icons**
   - Lucide React icons
   - 20-24px boyutunda
   - Mavi veya gri renk

---

## 🔮 Gelecek Özellikler (MVP Sonrası)

### Phase 11: Advanced Features

- [ ] **Recurring Appointments** - Tekrarlayan randevular
- [ ] **Package Booking** - Paket hizmet randevuları
- [ ] **Multi-service Booking** - Tek seferde birden fazla hizmet
- [ ] **Group Booking** - Grup randevuları
- [ ] **Waitlist** - Bekleme listesi
- [ ] **Gift Cards** - Hediye kartı kullanımı
- [ ] **Loyalty Points** - Sadakat puanı sistemi

### Phase 12: Integrations

- [ ] **Google Calendar Sync** - Takvim senkronizasyonu
- [ ] **Email Reminders** - Email hatırlatmaları
- [ ] **SMS Notifications** - SMS bildirimleri
- [ ] **WhatsApp Integration** - WhatsApp randevu
- [ ] **Zoom Integration** - Online randevular için
- [ ] **Social Login** - Google/Facebook ile giriş

### Phase 13: Analytics

- [ ] **Widget Analytics** - Widget kullanım istatistikleri
- [ ] **Conversion Tracking** - Dönüşüm takibi
- [ ] **A/B Testing** - Farklı tema testleri
- [ ] **Heatmap** - Kullanıcı davranışı haritası

### Phase 14: Customization

- [ ] **Custom CSS** - Özel CSS ekleme
- [ ] **Custom Fields** - Özel form alanları
- [ ] **Custom Steps** - Özel adımlar
- [ ] **Branding** - Logo ve marka özelleştirme

---

## 📊 İlerleme Takibi

**Genel İlerleme**: ~95%

| Faz | İsim                 | Durum         | İlerleme |
| --- | -------------------- | ------------- | -------- |
| 1   | Temel Altyapı        | ✅ Tamamlandı | 100%     |
| 2   | UI Component Library | ✅ Tamamlandı | 100%     |
| 3   | List Layout          | ✅ Tamamlandı | 100%     |
| 4   | Steps Layout         | ✅ Tamamlandı | 100%     |
| 5   | Build & Embed        | ✅ Tamamlandı | 100%     |
| 6   | State Management     | ✅ Tamamlandı | 100%     |
| 7   | Styling & Theming    | ✅ Tamamlandı | 100%     |
| 8   | Testing              | ⏳ Beklemede  | 0%       |
| 9   | Optimizasyon         | ⏳ Beklemede  | 0%       |
| 10  | Deployment           | ⏳ Beklemede  | 0%       |

**Toplam Tahmini Süre**: 8-10 Hafta (Full-time)

**Mevcut Sprint**: Sprint 8 ⏳ DEVAM EDİYOR - Testing & Deployment

**Tamamlanan Adımlar**:

1. ✅ Type definitions oluşturuldu
2. ✅ API service layer yazıldı
3. ✅ Context setup yapıldı
4. ✅ Storage & Validation services oluşturuldu
5. ✅ Custom hooks geliştirildi
6. ✅ Shadcn UI component'leri kuruldu (11 adet)
7. ✅ Shared components oluşturuldu
8. ✅ Layout components oluşturuldu
9. ✅ Utility functions oluşturuldu (price, date)
10. ✅ Service Selection step geliştirildi
11. ✅ Employee Selection step geliştirildi
12. ✅ Location Selection step geliştirildi
13. ✅ Extras Selection step geliştirildi
14. ✅ Date & Time Selection step geliştirildi
15. ✅ Customer Info step geliştirildi
16. ✅ Confirmation step geliştirildi (Payment atlandı)
17. ✅ StepsLayout wrapper oluşturuldu
18. ✅ ListLayout wrapper oluşturuldu
19. ✅ BookingWidget router component'i oluşturuldu
20. ✅ App.tsx'e context providers entegre edildi
21. ✅ Theme utils oluşturuldu (applyTheme, typography, button styles)
22. ✅ CSS variables system kuruldu
23. ✅ Google Fonts dynamic loading
24. ✅ Color conversion utilities (hexToHSL, generateColorShades)
25. ✅ Vite build configuration (code splitting, optimization)
26. ✅ Build scripts eklendi (build:prod, build:dev, type-check)
27. ✅ Environment variables setup (.env.development, .env.production)
28. ✅ Widget loader script oluşturuldu (inline & iframe modes)
29. ✅ widget.html iframe için hazırlandı
30. ✅ EMBED.md dokümantasyonu yazıldı
31. ✅ BUILD.md dokümantasyonu yazıldı
32. ✅ Auto-save draft system (1s debounce, 24h expiry)
33. ✅ Draft restore on mount
34. ✅ Skeleton loading components (Service, Staff, Location)
35. ✅ Animation utilities (stepTransition, fadeIn, slideUp, scaleIn)
36. ✅ Keyboard navigation hooks (useKeyboardNavigation, useFocusManagement)
37. ✅ ACCESSIBILITY.md comprehensive guide
38. ✅ Barrel exports updated (utils, hooks, shared)
39. ✅ Build & Embed sistem tamamlandı
40. ✅ Production build optimizasyonu yapıldı
41. ✅ Environment variables production-ready

**Sonraki Adımlar (Öncelik Sırası)**:

1. ⏳ Production build test et
2. ⏳ Testing framework kur (Vitest + React Testing Library)
3. ⏳ Unit tests yaz (utils, services)
4. ⏳ Component tests yaz (UI components)
5. ⏳ Integration tests (booking flow)
6. ⏳ Performance optimization (lazy loading, code splitting)
7. ⏳ CI/CD pipeline setup
8. ⏳ CDN deployment

---

## 🛠️ Teknik Notlar

### Build Output

```bash
# Development
npm run dev

# Production Build (Library mode)
npm run build
# Output:
# - dist/widget.js (UMD)
# - dist/widget.css
# - dist/widget-loader.js

# Preview
npm run preview
```

### Environment Variables

```env
VITE_API_BASE_URL=https://api.salontakvim.com
VITE_CDN_URL=https://cdn.salontakvim.com
VITE_WIDGET_VERSION=1.0.0
```

### Performance Targets

- Initial load: < 2s
- First contentful paint: < 1s
- Time to interactive: < 3s
- Bundle size: < 200KB (gzipped)

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📞 Katkıda Bulunma

Widget geliştirmesi için:

1. Type definitions önce tamamlanmalı
2. API service sonra yazılmalı
3. Component'ler type-safe olmalı
4. Her component için PropTypes/TypeScript types
5. Responsive design first
6. Accessibility standartları (WCAG AA)
7. Test coverage minimum %80

---

## 🎯 Başarı Kriterleri

✅ **MVP Başarı Kriterleri**:

- [ ] List layout tam çalışıyor
- [ ] Tüm 8 adım tamamlanmış
- [ ] API entegrasyonu çalışıyor
- [ ] Responsive design
- [ ] Theme özelleştirmesi çalışıyor
- [ ] Iframe embed çalışıyor
- [ ] WordPress shortcode çalışıyor
- [ ] Randevu başarıyla oluşturuluyor
- [ ] Error handling düzgün
- [ ] Loading states var

✅ **Quality Metrics**:

- [ ] Test coverage > %80
- [ ] Lighthouse score > 90
- [ ] Bundle size < 200KB
- [ ] Zero console errors
- [ ] Accessibility score > 90

---

## 📚 Kaynaklar

### Design Inspiration

- https://wpamelia.com/step-by-step-booking-form-2-0
- Amelia demo widgets
- Modern booking systems

### Documentation

- React 19 docs
- TailwindCSS docs
- Radix UI docs
- Vite library mode docs
- WordPress plugin development

### Tools

- Figma (design)
- Storybook (component showcase)
- React Developer Tools
- Lighthouse (performance)
- axe DevTools (accessibility)

---

**Son Güncelleme**: 2025-01-04
**Versiyon**: 1.0.0
**Durum**: Planlama Tamamlandı - Geliştirme Başlıyor 🚀
