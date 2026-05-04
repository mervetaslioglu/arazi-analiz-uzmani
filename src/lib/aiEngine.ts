import { LandInput, StageId } from "./types";

// Deterministic "AI" computation — produces realistic-looking outputs based on inputs.
// Real AI integration can replace these later via an edge function.

const fmt = (n: number, d = 0) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);

export function computeStage(stageId: StageId, input: LandInput): { data: Record<string, any>; summary: string } {
  switch (stageId) {
    case "F1":
      return f1(input);
    case "F2":
      return f2(input);
    case "F3":
      return f3(input);
    case "F4":
      return f4(input);
    case "F5":
      return f5(input);
    case "F6":
      return f6(input);
  }
}

function f1(i: LandInput) {
  const data = {
    parsel: {
      "Ad / Tanım": i.name,
      "Şehir": i.city,
      "İlçe": i.district,
      "Parsel Alanı": `${fmt(i.area)} m²`,
      "Köşe Parsel": i.cornerPlot ? "Evet" : "Hayır",
      "Topografya": { duz: "Düz", egimli: "Eğimli", "cok-egimli": "Çok Eğimli" }[i.topography],
    },
    dogrulama: [
      "✓ Parsel alanı doğrulandı",
      i.cornerPlot ? "✓ Köşe parsel — ekstra cephe avantajı" : "• Tek cepheli parsel",
      "✓ Topografya verisi kaydedildi",
    ],
  };
  return { data, summary: `${i.name} parseli (${fmt(i.area)} m²) yapılandırıldı ve doğrulandı.` };
}

function f2(i: LandInput) {
  const maxInsaat = i.area * i.emsal;
  const tabanAlan = i.area * i.taks;
  const maxKat = Math.floor(i.maxHeight / 3.2);
  const data = {
    imarKosullari: {
      "Fonksiyon": i.zoningType,
      "Emsal (E/KAKS)": i.emsal.toFixed(2),
      "TAKS": i.taks.toFixed(2),
      "Maks. Yapı Yüksekliği": `${i.maxHeight} m`,
      "Tahmini Maks. Kat": `${maxKat} kat`,
    },
    hesaplananHaklar: {
      "Maks. Toplam İnşaat Alanı": `${fmt(maxInsaat)} m²`,
      "Maks. Taban Oturum Alanı": `${fmt(tabanAlan)} m²`,
      "Bahçe / Açık Alan": `${fmt(i.area - tabanAlan)} m² (%${fmt((1 - i.taks) * 100, 0)})`,
    },
    notlar: [
      `${i.zoningType} fonksiyonu için emsal ${i.emsal} uygulanacaktır.`,
      `Çekme mesafeleri ön: 5m, yan: 3m, arka: 3m olarak öngörülmüştür.`,
      i.cornerPlot ? "Köşe parsel — iki cephede çekme mesafesi uygulanır." : "Tek cepheli — standart çekmeler.",
    ],
  };
  return {
    data,
    summary: `Maks. ${fmt(maxInsaat)} m² inşaat hakkı, ${maxKat} kat yapım potansiyeli tespit edildi.`,
  };
}

function f3(i: LandInput) {
  const slopeRisk = i.topography === "duz" ? "Düşük" : i.topography === "egimli" ? "Orta" : "Yüksek";
  const altyapi = i.area > 1000 ? "Yeterli" : "Sınırlı";
  const data = {
    zemin: {
      "Topografya": slopeRisk + " eğim riski",
      "Tahmini Hafriyat": i.topography === "duz" ? `${fmt(i.area * 1.5)} m³` : `${fmt(i.area * 4)} m³`,
      "İstinat Duvarı İhtiyacı": i.topography === "cok-egimli" ? "Gerekli" : "Sınırlı",
    },
    altyapi: {
      "Altyapı Durumu": altyapi,
      "Otopark Yaklaşımı": i.cornerPlot ? "Çift cepheden mümkün" : "Tek cepheden",
    },
    riskler: [
      i.topography === "cok-egimli" ? "⚠ Yüksek eğim — temel mühendisliği kritik" : "✓ Temel sistemi standart",
      "✓ Güneşlenme kuzey-güney aksında ideal",
    ],
  };
  return { data, summary: `Zemin riski: ${slopeRisk}. Altyapı durumu: ${altyapi}.` };
}

function f4(i: LandInput) {
  const maxInsaat = i.area * i.emsal;
  const tabanAlan = i.area * i.taks;
  const maxKat = Math.floor(i.maxHeight / 3.2);
  const isResidential = /konut/i.test(i.zoningType);
  const unitSize = isResidential ? 95 : 70;
  const efficiency = 0.78;
  const satilabilir = maxInsaat * efficiency;
  const unite = Math.floor(satilabilir / unitSize);

  const data = {
    konsept: {
      "Tipoloji": isResidential ? "Çok katlı konut bloğu" : "Karma kullanım (ticaret + konut)",
      "Yerleşim": i.cornerPlot ? "L-formda köşe yerleşimi" : "Lineer blok yerleşimi",
      "Cephe Yönelimi": "Güney + Doğu ağırlıklı",
      "Otopark": "Bodrum kat (2 seviye önerilir)",
    },
    program: {
      "Toplam İnşaat Alanı": `${fmt(maxInsaat)} m²`,
      "Satılabilir / Kiralanabilir Alan": `${fmt(satilabilir)} m² (verim %${fmt(efficiency * 100)})`,
      "Ortalama Birim Büyüklüğü": `${unitSize} m²`,
      "Tahmini Birim Sayısı": `${unite} adet`,
      "Kat Sayısı": `${maxKat} normal kat + 2 bodrum`,
      "Taban Alanı": `${fmt(tabanAlan)} m²`,
    },
    stratejiNotlari: [
      "Zemin kat: lobi, sosyal alanlar (konut) / ticari (karma)",
      `${maxKat - 1} adet tip kat, çatı katı teras`,
      "Sürdürülebilirlik: yağmur suyu hasadı + PV panel hazırlığı",
    ],
  };
  return {
    data,
    summary: `${unite} birim, ${maxKat} kat, ${fmt(satilabilir)} m² satılabilir alan stratejisi.`,
  };
}

function f5(i: LandInput) {
  const maxInsaat = i.area * i.emsal;
  const efficiency = 0.78;
  const satilabilir = maxInsaat * efficiency;
  const isResidential = /konut/i.test(i.zoningType);

  // TRY assumptions — illustrative
  const arsaBedeli = i.area * (i.city.toLowerCase().includes("istanbul") ? 85000 : 35000);
  const insaatMaliyetiM2 = isResidential ? 22000 : 26000;
  const toplamInsaatMaliyeti = maxInsaat * insaatMaliyetiM2;
  const yumusakMaliyet = toplamInsaatMaliyeti * 0.12;
  const toplamMaliyet = arsaBedeli + toplamInsaatMaliyeti + yumusakMaliyet;

  const satisFiyatiM2 = isResidential
    ? i.city.toLowerCase().includes("istanbul")
      ? 95000
      : 55000
    : 70000;
  const toplamGelir = satilabilir * satisFiyatiM2;
  const brutKar = toplamGelir - toplamMaliyet;
  const karMarji = (brutKar / toplamGelir) * 100;
  const roi = (brutKar / toplamMaliyet) * 100;

  const data = {
    maliyetler: {
      "Arsa Bedeli (tahmini)": `₺ ${fmt(arsaBedeli)}`,
      "İnşaat Maliyeti": `₺ ${fmt(toplamInsaatMaliyeti)} (${fmt(insaatMaliyetiM2)} ₺/m²)`,
      "Yumuşak Maliyetler (%12)": `₺ ${fmt(yumusakMaliyet)}`,
      "TOPLAM YATIRIM": `₺ ${fmt(toplamMaliyet)}`,
    },
    gelir: {
      "Satılabilir Alan": `${fmt(satilabilir)} m²`,
      "Ortalama Satış Fiyatı": `₺ ${fmt(satisFiyatiM2)} / m²`,
      "TOPLAM GELİR (tahmini)": `₺ ${fmt(toplamGelir)}`,
    },
    karlilik: {
      "Brüt Kar": `₺ ${fmt(brutKar)}`,
      "Kar Marjı": `% ${fmt(karMarji, 1)}`,
      "ROI (Yatırım Getirisi)": `% ${fmt(roi, 1)}`,
      "Geri Dönüş Süresi (tahmini)": `${fmt(36 + (30 - karMarji) * 0.5, 0)} ay`,
    },
    _raw: { toplamMaliyet, toplamGelir, brutKar, karMarji, roi },
  };

  return {
    data,
    summary: `ROI %${fmt(roi, 1)}, kar marjı %${fmt(karMarji, 1)}. Brüt kar ₺${fmt(brutKar)}.`,
  };
}

function f6(i: LandInput) {
  const maxInsaat = i.area * i.emsal;
  const f5Data = f5(i).data._raw as any;
  const verdict =
    f5Data.karMarji > 25 ? "ÖNERİLİR" : f5Data.karMarji > 15 ? "DİKKATLİ İLERLE" : "RİSKLİ";
  const verdictColor = f5Data.karMarji > 25 ? "success" : f5Data.karMarji > 15 ? "warning" : "destructive";

  const data = {
    karar: {
      "Genel Değerlendirme": verdict,
      "Kar Marjı": `% ${fmt(f5Data.karMarji, 1)}`,
      "ROI": `% ${fmt(f5Data.roi, 1)}`,
      _verdictColor: verdictColor,
    },
    ozet: [
      `${i.name} parseli, ${i.city}/${i.district} lokasyonunda ${fmt(i.area)} m² büyüklüğündedir.`,
      `${i.zoningType} fonksiyonu altında ${i.emsal} emsal ile ${fmt(maxInsaat)} m² inşaat hakkı bulunmaktadır.`,
      `Önerilen tasarım stratejisi ve maliyet/gelir analizi doğrultusunda proje %${fmt(f5Data.karMarji, 1)} kar marjı ve %${fmt(f5Data.roi, 1)} ROI sunmaktadır.`,
      verdict === "ÖNERİLİR"
        ? "Sonuç: Yatırım için olumlu sinyaller mevcut, geliştirme süreci başlatılabilir."
        : verdict === "DİKKATLİ İLERLE"
        ? "Sonuç: Marjlar makul ancak optimizasyon gerektirir. Maliyet kalemleri yeniden değerlendirilmeli."
        : "Sonuç: Mevcut koşullarda risk yüksek. Alternatif fonksiyon veya pazarlık stratejisi önerilir.",
    ],
    sonrakiAdimlar: [
      "Mimari avan proje hazırlığı",
      "Zemin etüdü ve jeoteknik raporu",
      "Belediye ön onay süreci",
      "Detaylı pazar analizi ve fiyatlama",
      "Finansman modeli yapılandırma",
    ],
  };

  return { data, summary: `Karar: ${verdict}. Yönetici özeti tamamlandı.` };
}
