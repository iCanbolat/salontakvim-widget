# SalonTakvim Widget Embed Kılavuzu

## Widget Entegrasyonu

SalonTakvim booking widget'ını sitenize 3 farklı yöntemle ekleyebilirsiniz:

### 1. Inline Mode (Önerilen)

Widget sayfanıza doğrudan gömülür ve sayfa içeriğinin bir parçası olur.

```html
<!-- Widget container -->
<div id="booking-widget"></div>

<!-- Widget loader script -->
<script
  src="https://cdn.salontakvim.com/widget-loader.js"
  data-widget-key="wk_your_widget_key_here"
  data-mode="inline"
  data-container="#booking-widget"
></script>
```

### 2. Iframe Mode

Widget bir iframe içinde yüklenir. Sitenizdeki stil ve scriptlerden izole çalışır.

```html
<script
  src="https://cdn.salontakvim.com/widget-loader.js"
  data-widget-key="wk_your_widget_key_here"
  data-mode="iframe"
></script>
```

### 3. Direct Import (React/Next.js Projects)

React projelerinde doğrudan npm package olarak kullanabilirsiniz.

```bash
npm install @salontakvim/booking-widget
```

```jsx
import { BookingWidget } from "@salontakvim/booking-widget";
import "@salontakvim/booking-widget/dist/style.css";

function MyPage() {
  return (
    <BookingWidget
      widgetKey="wk_your_widget_key_here"
      onComplete={(appointment) => {
        console.log("Appointment created:", appointment);
      }}
    />
  );
}
```

## Konfigürasyon Seçenekleri

Widget loader script'ine `data-config` attribute'u ile ek ayarlar gönderebilirsiniz:

```html
<script
  src="https://cdn.salontakvim.com/widget-loader.js"
  data-widget-key="wk_your_widget_key_here"
  data-config='{"preselectedService": 5, "language": "tr", "theme": "light"}'
></script>
```

### Mevcut Seçenekler

| Parametre            | Tip     | Varsayılan | Açıklama                         |
| -------------------- | ------- | ---------- | -------------------------------- |
| `preselectedService` | number  | -          | Önceden seçili hizmet ID         |
| `preselectedStaff`   | number  | -          | Önceden seçili personel ID       |
| `language`           | string  | 'tr'       | Dil ('tr', 'en')                 |
| `theme`              | string  | 'light'    | Tema ('light', 'dark')           |
| `hideHeader`         | boolean | false      | Header'ı gizle                   |
| `hideSidebar`        | boolean | false      | Sidebar'ı gizle                  |
| `autoScroll`         | boolean | true       | Adım değişiminde otomatik scroll |

## WordPress Entegrasyonu

WordPress sitelerinize shortcode ile ekleyebilirsiniz:

```
[salontakvim key="wk_your_widget_key_here"]
```

Ek parametrelerle:

```
[salontakvim key="wk_your_widget_key_here" mode="inline" service="5"]
```

### WordPress Plugin Kurulumu

1. WordPress admin paneline giriş yapın
2. Plugins > Add New
3. "SalonTakvim" arayın ve yükleyin
4. Plugin ayarlarından widget key'inizi girin
5. İstediğiniz sayfaya shortcode ekleyin

## Styling & Customization

Widget'ın görünümünü CSS ile özelleştirebilirsiniz:

```css
/* Widget container */
.salontakvim-widget-root {
  max-width: 1200px;
  margin: 0 auto;
}

/* Custom primary color */
.salontakvim-widget-root {
  --primary: 220 90% 55%;
  --primary-foreground: 0 0% 100%;
}

/* Custom font */
.salontakvim-widget-root {
  --font-family: "Your Font", sans-serif;
}
```

## Events & Callbacks

Widget'tan gelen olayları dinleyebilirsiniz:

```javascript
window.addEventListener("salontakvim:ready", (event) => {
  console.log("Widget loaded:", event.detail);
});

window.addEventListener("salontakvim:appointment-created", (event) => {
  console.log("Appointment created:", event.detail.appointmentId);
  // Google Analytics tracking
  gtag("event", "appointment_created", {
    appointment_id: event.detail.appointmentId,
  });
});

window.addEventListener("salontakvim:error", (event) => {
  console.error("Widget error:", event.detail.error);
});
```

## Performance Tips

1. **Lazy Loading**: Widget'ı sadece görünür olduğunda yükleyin

   ```html
   <script defer src="..."></script>
   ```

2. **Preconnect**: API'ye önceden bağlanın

   ```html
   <link rel="preconnect" href="https://api.salontakvim.com" />
   ```

3. **CDN Caching**: Static dosyalar için uzun cache süreleri kullanın

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Mobile

## Troubleshooting

### Widget yüklenmiyor

1. Console'da hata var mı kontrol edin
2. Widget key'in doğru olduğundan emin olun
3. CDN erişilebilir mi test edin

### Stil problemleri

1. CSS충돌 olabilir, iframe mode'u deneyin
2. z-index değerlerini kontrol edin
3. Custom CSS'inizin widget CSS'inden sonra yüklendiğinden emin olun

### API Hataları

1. Network tab'inde API isteklerini kontrol edin
2. CORS ayarlarının doğru olduğundan emin olun
3. Widget key'in aktif olduğunu doğrulayın

## Support

Destek için: support@salontakvim.com
Dokümantasyon: https://docs.salontakvim.com
