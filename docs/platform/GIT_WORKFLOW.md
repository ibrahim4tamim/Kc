# سير العمل على Git — Git Workflow

> **حالة الوثيقة:** ✅ موثّق.

## 1. الفروع الأساسية

| الفرع | الدور | قابل للتعديل؟ |
|---|---|---|
| `claude/kawalis-china-sourcing-mvp-hpz3po` | أساس v1.0 المعتمد (الفرع الافتراضي) | ❌ **لا يُمَس إطلاقًا** |
| `backup/v1.0-mvp` | نسخة احتياطية من v1.0 | ❌ للأرشفة فقط |
| `kc-platform-v2` | تطوير الجيل الثاني (المنصة) | ✅ نعم |

## 2. القواعد الصارمة

1. **لا تعدّل** الفرع `claude/kawalis-china-sourcing-mvp-hpz3po`.
2. **لا تغيّر** الفرع الافتراضي.
3. اعمل **فقط** داخل `kc-platform-v2` أو فروع تتفرّع منه.
4. حافظ على كل ملفات MVP القائمة ما لم يُطلب خلاف ذلك صراحة.

## 3. تدفّق العمل

```
claude/…mvp-hpz3po (الأساس المعتمد، للقراءة)
        │
        └──► kc-platform-v2 (تطوير المنصة)
                    │
                    └──► فروع مهام قصيرة (اختياري) ──► PR ──► kc-platform-v2
```

## 4. رسائل الـ Commit

نستخدم [Conventional Commits](https://www.conventionalcommits.org/):

```
docs:     تغييرات توثيق فقط
feat:     ميزة جديدة
fix:      إصلاح خطأ
refactor: إعادة هيكلة دون تغيير سلوك
chore:    مهام صيانة
```

مثال: `docs: organize platform documentation structure`

## 5. الدمج

- التغييرات تُدمج في `kc-platform-v2` عبر Pull Request.
- لا دمج مباشر في الفرع الافتراضي.

---
*راجع [README.md](README.md) لحالة التوثيق.*
