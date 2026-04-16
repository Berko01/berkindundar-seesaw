# Seesaw Simulation

Basit bir tahterevalli simülasyonu. Kullanıcı plank'ın herhangi bir noktasına tıklıyor, sistem oraya rastgele bir ağırlık bırakıyor ve sağ-sol taraftaki tork farkına göre tahterevalli eğiliyor.

Projeyi özellikle küçük, anlaşılır ve kütüphanesiz tutmaya çalıştım. Her şey sadece HTML, CSS ve JavaScript ile çalışıyor.

**Demo:** [berkindundar.github.io/seesaw-simulation](https://berkindundar.github.io/seesaw-simulation)

## Ne Yapıyor?

- Plank'a tıklayınca 1-10 kg arasında rastgele bir obje ekleniyor
- Objelerin konumu ve ağırlığına göre denge hesabı yapılıyor
- Tahterevalli sağa ya da sola yatıyor
- Sol ve sağ toplam ağırlık ekranda gösteriliyor
- Pause / Resume ve Reset kontrolleri var
- Sayfa yenilense bile objeler `localStorage` sayesinde korunuyor

## Hesap Mantığı

Uygulamanın mantığı basit:

```text
torque = weight × distance
angle = clamp((rightTorque - leftTorque) / 10, -30, 30)
```

Yani pivot noktasına uzak ve ağır bir obje, eğimi daha fazla etkiliyor. Sağ tarafın toplam torku büyükse tahterevalli sağa, sol tarafınki büyükse sola yatıyor.

## Neden Bu Şekilde Yazıldı?

Bu proje için çok karmaşık bir yapı kurmak istemedim. İhtiyaç küçük olduğu için okunması kolay bir yapı daha mantıklıydı.

- Tüm veri tek bir `state` nesnesinde tutuluyor.
- State değişince `render()` tekrar çalışıyor ve görünüm güncelleniyor.
- Objeler her seferinde yeniden çiziliyor. Bu proje ölçeğinde bu yaklaşım hem yeterli hem de sade.
- Eğme animasyonu JavaScript ile frame frame yönetilmedi; `transform: rotate()` ve CSS `transition` kullanıldı.

Kısacası amaç "en gelişmiş çözüm" değil, küçük bir problemi temiz ve anlaşılır şekilde çözmekti.

## Dosya Yapısı

```text
seesaw/
├── index.html    — sayfa yapısı
├── style.css     — görünüm ve animasyonlar
└── seesaw.js     — uygulama mantığı
```

## Kısıtlar ve Bilinçli Tercihler

- Canvas kullanmadım; tüm görsel yapı DOM elementleriyle oluşturuldu.
- Aynı noktaya birden fazla kez tıklanırsa objeler üst üste binebilir.
- Obje sayısı çok fazla artarsa performans düşebilir ama bu demo için pratikte sorun yaratmaz.
- Mobilde plank küçülüyor; fizik hesabı yine aynı mantıkla çalışıyor.

## AI Kullanımı

Kod yazım sürecinde Claude'dan destek alındı. Genel yaklaşım, mimari kararlar ve son düzenlemeler tarafımca yapıldı; AI daha çok fikir yürütme ve üretim hızlandırma tarafında yardımcı oldu.
