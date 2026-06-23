# Propuesta Funcional — Tienda Online Icónico

> Versión 1.1 · Junio 2026 · Documento para revisión

---

## 1. Resumen ejecutivo

Hoy Icónico vende café de especialidad, pero lo hace sin una tienda online que recompense a quienes vuelven. Queremos construir esa tienda: un lugar donde cualquier persona pueda comprar café (con o sin cuenta), suscribirse para recibirlo cada mes, y obtener puntos con cada compra que la hagan subir de rango dentro de una escalera de 10 niveles llamada **"El programa Icónico"**.

Pero hay una diferencia clave con un programa de puntos típico: **los puntos hacen dos cosas a la vez**.

1. **Suman para subir de rango** (de Grano hasta Icónico), como un videojuego.
2. **Se canjean por productos exclusivos** en un catálogo que solo se paga con puntos — como un cashback de tarjeta Gold o Platino.

A esto le sumamos **envíos a todo México** con reglas claras de cuándo son gratis, y un sistema que baja de rango al que se va, pero sube fácil al que vuelve.

La idea es simple: **comprar debe ser fácil, regresar debe valer la pena, y nunca sentir que te engañan**.

**Lo que NO está incluido en esta primera versión:**
- App móvil nativa (iOS / Android).
- Venta en otros países o monedas distintas al peso mexicano.
- Marketplace con varios vendedores.
- Programa de referidos ("invita a un amigo y gana puntos").

Todo eso puede llegar después. Esta propuesta se enfoca en construir una base sólida que se pueda extender.

---

## 2. El problema que resolvemos

- **El cliente que prueba una vez no regresa.** No hay nada que lo invite a volver. No recibe seguimiento, no acumula nada, no siente que su lealtad vale.
- **El cashback no existe.** Cada peso que el cliente gasta se va. No hay devolución, no hay recompensa por la confianza de elegirte.
- **Las suscripciones se manejan a mano o no existen.** El cliente recurrente (el más valioso) no tiene una forma simple de decir "mándame el café cada mes y yo me olvido".
- **Los envíos son confusos.** El cliente no sabe cuánto va a pagar hasta el final, o si aplica gratis, o por qué. Falta claridad.
- **El catálogo cambia lento.** Agregar un producto nuevo o quitar uno agotado hoy requiere tocar código. Eso frena al equipo.
- **No hay datos del cliente.** No sabemos quién compra, qué le gusta, cuánto gasta, ni por qué se fue. Sin datos no se puede crecer con confianza.

---

## 3. La solución en una frase

**Una tienda online que premia comprar café como si fuera un videojuego: cada compra te da puntos que suben tu nivel Y te devuelven cashback real, y ser mejor cliente se nota.**

---

## 4. Las 5 grandes capacidades

### 🛒 1. Comprar fácil (incluso sin registrarse)

**Qué es:** Cualquier persona puede comprar café sin crear cuenta. Solo pone su email, su nombre, su dirección y paga.

**Beneficio para el cliente:** "No me piden 10 datos para comprar un café. Lo hago en 2 minutos."

**Beneficio para el negocio:** Más ventas. Cada paso extra en un formulario es un cliente que se va.

**Analogía:** Como pedir un café en la app de tu tienda favorita — entras, eliges, pagas, te vas. Sin 注册.

---

### 💰 2. Recompensar la lealtad (puntos duales, como tarjeta Gold/Platino)

**Qué es:** Cada compra genera **dos tipos de puntos al mismo tiempo**, igual que una tarjeta de crédito premium:

- **Puntos de Rango** → suman para subir de nivel (10 niveles, de Grano a Icónico). Son tuyos para siempre.
- **Puntos Canjeables** → son tu "cashback": 10% del subtotal, amplificado según tu nivel. **1 punto = $0.10 MXN**. Los usas para canjear productos exclusivos.

**Beneficio para el cliente:** "Mientras más compro, más gano. Y parte de lo que gasto vuelve a mi bolsillo en forma de productos."

**Beneficio para el negocio:** Clientes que regresan. Los puntos no gastados son una promesa que mantiene al cliente enganchado. Los puntos canjeados son una recompensa que refuerza la próxima compra.

**Analogía:** Como una tarjeta de crédito Gold o Platino — cada compra te acerca a un upgrade, y un porcentaje vuelve como cashback que puedes usar como quieras.

> Ver detalle completo en la sección 5.

---

### 📦 3. Suscripciones mensuales (el "café que llega solo")

**Qué es:** El cliente puede decir "mándame tu café cada mes, cobrámelo automáticamente". Él se olvida; el café llega. Puede pausar o cancelar cuando quiera desde su cuenta, sin llamar a nadie.

**Beneficio para el cliente:** "No me preocupo por pedirlo, no se me olvida, y ahorro por no comprarlo de improviso."

**Beneficio para el negocio:** Ingreso predecible. Una suscripción mensual es más valiosa que 12 compras separadas.

**Analogía:** Como una caja mensual por suscripción — llega sola, la abres, la disfrutas.

---

### 🚚 4. Envíos claros y nacionales (a todo México)

**Qué es:** Cobertura a cualquier código postal del país. El cliente sabe desde el carrito cuánto le falta para envío gratis, y el costo se calcula en vivo al poner su CP en el checkout.

**Reglas simples de envío gratis (cualquiera de estas):**
1. Compra mayor a $1,900 MXN.
2. Es una suscripción mensual.
3. Es un pack.
4. El cliente es rango **Catador o superior** (envío estándar gratis siempre).
5. El cliente decide pagar el envío con puntos canjeables.

**Costo de envío estándar:** $99 MXN. Express: $149 MXN. Gratis en los casos de arriba.

**Beneficio para el cliente:** "Sé exactamente cuánto voy a pagar antes de hacer checkout. Y si soy cliente frecuente, ya ni siquiera pienso en el envío."

**Beneficio para el negocio:** Menos carritos abandonados por sorpresas en el envío. Más clientes que llegan al rango Catador para no pagar envío nunca más.

---

### ⚙️ 5. Autoservicio y gestión (que el cliente y tú se arreglen solos)

**Qué es:**
- El cliente tiene su cuenta donde ve: sus dos saldos de puntos, su rango, su historial, sus suscripciones, sus datos.
- Tú (admin) tienes un panel privado donde: agregas productos, editas rangos, subes fotos, gestionas el catálogo canjeable, ves pedidos — sin tocar código.

**Beneficio para el cliente:** "No tengo que esperar a soporte para ver cuánto llevo comprado o cambiar mi dirección."

**Beneficio para el negocio:** Menos tickets de soporte. Catálogo siempre actualizado sin esperar a un developer.

**Analogía:** Como el portal de tu banco + la trastienda de tu tienda física.

---

## 5. El programa "Icónico" — 10 rangos, dos saldos, una escalera

Funciona como un **videojuego de rol con cashback de tarjeta premium**: empiezas siendo un novato y, según compras, subes de nivel. Cada nivel te da más puntos, más cashback y beneficios nuevos.

### Los dos saldos (cómo se ven en la cuenta del cliente)

```
┌──────────────────────────────────────────┐
│  🏆  TU RANGO: Catador                   │
│  Multiplicador 1.20x · Cashback 12%      │
│  Barra: ████████░░░░ 1,200/1,800 pts     │
│  → Próximo: Maestro                     │
├──────────────────────────────────────────┤
│  💰  TUS PUNTOS CANJEABLES: 850          │
│  Equivalente: $85.00 MXN                 │
│  Próximo a expirar: 120 pts en 47 días  │
│  [Ver catálogo canjeable]               │
└──────────────────────────────────────────┘
```

### Cómo se calculan en cada compra

```
Compra: $1,000 MXN, rango Catador (1.20x, 12% cashback)

Puntos de Rango ganados:      1,000 × 1.20 = 1,200 pts (vitalicios)
Puntos Canjeables ganados:    1,000 × 10% × 1.20 = 120 pts ($12 MXN)
Envío gratis:                 ✓ (Catador+)
```

### La escalera de 10 niveles

| Nivel | Nombre | Puntos vitalicios | Multiplicador | Cashback | Envío gratis | Beneficio |
|---|---|---|---|---|---|---|
| 1 | **Grano** | 0 | 1.00x | 10% | — | Acumulación base. |
| 2 | **Tueste** | 200 | 1.05x | 10.5% | — | Acceso a catas mensuales. |
| 3 | **Cata** | 500 | 1.10x | 11% | — | 5% de descuento en packs. |
| 4 | **Barista** | 1,000 | 1.15x | 11.5% | — | Envío gratis desde $500 MXN. |
| 5 | **Catador** | 1,800 | 1.20x | 12% | ✅ Estándar | 10% desc suscripciones + envío gratis. |
| 6 | **Maestro** | 3,000 | 1.30x | 13% | ✅ Estándar | 1 cata gratis al año. |
| 7 | **Embajador** | 5,000 | 1.40x | 14% | ✅ Estándar | Acceso anticipado a microlotes. |
| 8 | **Sommelier** | 8,000 | 1.50x | 15% | ✅ Estándar | Regalo de cumpleaños. |
| 9 | **Leyenda** | 12,000 | 1.75x | 17.5% | ✅ Ambos | Edición limitada anual gratis. |
| 10 | **Icónico** | 20,000 | 2.00x | 20% | ✅ Ambos | Tu nombre en la bolsa del año + todos los anteriores. |

### Catálogo canjeable (productos exclusivos por puntos)

Los puntos canjeables **no se canjean por dinero**, sino por productos especiales que solo existen en este catálogo:

| Producto | Costo | Valor | Rango mínimo |
|---|---|---|---|
| Catación privada virtual | 500 pts | $50 MXN | Grano |
| Microlote especial 100g | 1,000 pts | $100 MXN | Tueste |
| Pack regalo premium | 800 pts | $80 MXN | Tueste |
| Catación presencial | 2,000 pts | $200 MXN | Cata |
| Edición Icónico anual 250g | 5,000 pts | $500 MXN | Icónico |

**Reglas del canje:**
- 1 punto = $0.10 MXN (valor fijo, no cambia con el rango).
- Los puntos canjeables **expiran a los 12 meses** si no se usan.
- Si el cliente canjea puntos para pagar el envío, descuenta 1 punto por cada $0.10 MXN.

### ¿Qué pasa si el cliente deja de comprar?

| Tiempo sin comprar | Efecto |
|---|---|
| Menos de 6 meses | Todo igual. |
| 6 meses o más (sin suscripción activa) | **Baja 1 nivel** de rango. |
| 12 meses o más (sin suscripción activa) | **Baja a Grano**. **Expiran todos los puntos canjeables**. |
| **Suscripción activa** | **Rango congelado**. No se pierde mientras esté activa. |

**Pre-aviso amable:** 30 días antes de cualquier downgrade o expiración, se envía un email recordatorio. No es sorpresa, es motivación para volver.

**Por qué importa al negocio:** el nivel **"Icónico"** — el más alto — se llama como la marca. Un cliente que llega ahí es un evangelista. Le puso su nombre a la bolsa del año. No se va.

---

## 6. El viaje del cliente (cómo se siente)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ DESCUBRE │ →  │  COMPRA  │ →  │  GANA    │ →  │  REGRESA │
│          │    │          │    │  PUNTOS  │    │          │
│ Landing  │    │ Tienda   │    │ Email    │    │ Compra   │
│ Tienda   │    │ Checkout │    │ Notif    │    │ otra vez │
│ Redes    │    │ Pago     │    │ "sumaste │    │ o se     │
│          │    │          │    │  X pts"  │    │ suscribe │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │                              │
                     ↓                              ↓
              ┌──────────┐                    ┌──────────┐
              │ OPCIONAL │                    │  SUBE DE │
              │ Crear    │                    │  RANGO   │
              │ cuenta   │                    │ "Eres    │
              │ (con     │                    │  Plata!" │
              │ upsell)  │                    └──────────┘
              └──────────┘                           │
                                                     ↓
                                              ┌──────────┐
                                              │  CANJEA  │
                                              │ puntos   │
                                              │ por      │
                                              │ productos│
                                              └──────────┘
```

**Escenario 1 — Laura, invitada que prueba:**
1. Ve un anuncio del nuevo microlote en Instagram.
2. Entra a la tienda, agrega 1 bolsa al carrito ($450 MXN).
3. Paga con tarjeta. Sin crear cuenta. Listo en 90 segundos.
4. Le llega un email: "Tu compra fue un éxito. **¿Sabías que si te hubieras registrado, habrías ganado 54 puntos canjeables = $5.40 MXN?** [Crear cuenta y guardar mis puntos]"
5. Crea la cuenta con un click. Sus 54 puntos ya están ahí.
6. Cada compra futura suma a su rango y a su cashback.

**Escenario 2 — Roberto, el recurrente Catador:**
1. Ya tiene cuenta, ya es nivel "Catador" (1.20x, 12% cashback, envío gratis).
2. Cada mes le llega su suscripción. No piensa en eso.
3. Cuando quiere un café extra, lo compra: $1,000 MXN → gana 1,200 puntos de rango + 120 puntos canjeables ($12 MXN).
4. En su cumpleaños recibe un café de regalo (beneficio Sommelier, cuando llegue).
5. Tiene 850 puntos canjeables acumulados → entra al catálogo y canjea por un microlote especial de 100g.
6. Algún día, si sigue comprando, será "Icónico". Su nombre irá en la bolsa del año.

**Escenario 3 — Carmen, que dejó de comprar 7 meses:**
1. Hace 7 meses que no compra.
2. Le llega un email: "Te extrañamos. Tu rango Catador está por bajar a Cata. Vuelve a comprar antes del 15 de julio para mantenerlo."
3. Si no compra → baja a Cata. Si no compra en 12 meses → baja a Grano y pierde los puntos canjeables.

---

## 7. Lo que puedes hacer tú (administrador)

Sin tocar código, desde un panel privado:

- ➕ **Agregar productos** al catálogo normal (nombre, descripción, precio, gramaje, imagen, origen, tueste, notas, stock).
- ✏️ **Editar productos:** cambiar precio, descripción, foto, stock.
- 🚫 **Activar / desactivar productos:** ocultar uno agotado sin eliminarlo.
- 🏆 **Editar los 10 rangos:** nombre, puntos mínimos, multiplicador, cashback, beneficios.
- 🎁 **Gestionar catálogo canjeable:** agregar productos exclusivos por puntos (microlotes, cataciones, ediciones limitadas), editar costos, stock, rango mínimo requerido.
- 📋 **Ver pedidos:** quién compró qué, cuándo, cuánto, con qué método pagó.
- 📧 **Ver suscriptores:** quién está suscrito, desde cuándo, cuándo se le cobra.
- 🚚 **Configurar envíos:** zona nacional por ahora, costos estándar/express, monto mínimo para envío gratis.

---

## 8. Pagos en México

El cliente puede pagar como prefiera:

| Método | Cómo funciona | Beneficio |
|---|---|---|
| 💳 **Tarjeta** (Visa, Mastercard, Amex) | La clásica. Nacional o internacional. | Universal. |
| 📱 **Apple Pay / Google Pay** | Un toque, sin teclear datos. | Comodidad. |
| 🏦 **SPEI** (transferencia bancaria) | Le genera una referencia, paga desde su banco. | **10% de descuento** — la forma más barata. |
| 🏪 **OXXO** | Le genera un voucher, paga en cualquier OXXO en efectivo. | Para quien no tiene tarjeta. |
| 📆 **Meses sin intereses (MSI)** | 3, 6 o 12 mensualidades con tarjeta. | Flexibilidad de pago. |

Todo se procesa con seguridad bancaria estándar (PCI-DSS). Nosotros nunca vemos ni tocamos los datos de la tarjeta.

**Moneda:** pesos mexicanos (MXN).

---

## 9. Envíos (a todo México)

| Método | Costo | Tiempo estimado |
|---|---|---|
| Estándar | $99 MXN | 3-5 días |
| Express | $149 MXN | 1-2 días |
| **Gratis** | $0 MXN | mismo método |

**Envío gratis cuando se cumple CUALQUIERA de estas:**

1. 🛒 Tu compra es de $1,900 MXN o más.
2. 📦 Estás comprando un pack.
3. 🔄 Estás comprando una suscripción.
4. 🏆 Eres rango Catador o superior (envío estándar gratis siempre).
5. 💰 Decides pagar el envío con tus puntos canjeables (1 punto = $0.10 MXN).

**Lo que ve el cliente en la tienda:**
- En el carrito: una barra de progreso dice "Te faltan $X para envío gratis" (o "¡Envío gratis!" si ya calificó).
- En el checkout: pone su código postal y el sistema calcula el costo exacto y el tiempo estimado en vivo.

---

## 10. Costos

| Servicio | Qué hace | Costo |
|---|---|---|
| **Hosting** (donde vive la página) | Sirve la tienda al mundo. | **$0 al inicio.** Crece con las ventas. |
| **Base de datos** (donde se guardan usuarios, pedidos, puntos) | Almacena todo de forma segura. | **$0 al inicio.** Plan gratuito cubre las primeras 50,000 cuentas. |
| **Emails transaccionales** (confirmaciones, recibos, "sumaste puntos") | Le habla al cliente cuando corresponde. | **$0 al inicio.** Plan gratuito cubre 3,000 emails/mes. |
| **Procesador de pagos** (Stripe) | Cobra al cliente, te deposita a ti. | **~3% de comisión por cada venta.** Solo se cobra si la venta fue exitosa. |
| **Dominio** (`iconico.cafe`) | La dirección de la tienda. | **~$250 MXN al año.** |
| **Total al empezar** | | **$0 fijos + comisión por venta** |

**Lectura simple:** Mientras las ventas son pocas, el costo fijo es prácticamente cero. Lo único que se paga siempre es la comisión por venta (que es lo normal en cualquier tienda online). El costo fijo empieza a importar cuando la tienda crece — y para entonces, los ingresos lo justifican.

---

## 11. Riesgos (y cómo los manejamos)

| Riesgo | Qué pasa | Cómo lo manejamos |
|---|---|---|
| **Pago con SPEI tarda horas en confirmarse** | El cliente pagó pero el sistema no lo sabe todavía. | Mostramos "pago en proceso" y actualizamos automáticamente cuando el banco confirma. |
| **Cliente olvidó su contraseña** | No puede entrar. | Le enviamos un link mágico a su email. Un click, entra. |
| **Cliente deja de comprar y olvida sus puntos** | Inactividad puede hacerlo perder rango y cashback. | Email recordatorio 30 días antes. Rango se "congela" si tiene suscripción activa. |
| **Hackeo o robo de datos** | Alguien quiere robar puntos o datos. | La base de datos tiene reglas de seguridad por usuario: nadie ve datos ajenos. |
| **El cliente compra y nunca le llegan los puntos** | Error técnico. | Email automático de confirmación con los puntos ganados. Si no llega, contactas a soporte y se revisa. |
| **El sistema dual confunde al cliente** | "Tengo dos tipos de puntos, ¿cuál es cuál?" | UI clara con dos secciones: "Tu rango" y "Tus puntos canjeables", cada una con su icono y su valor. |

---

## 12. Próximos pasos

1. **Aprobar esta propuesta.** Confirmar que las 5 capacidades, el sistema dual de puntos, los 10 rangos, el catálogo canjeable, los métodos de pago y las reglas de envío son las correctas.
2. **Crear las cuentas de servicio** (hosting, base de datos, procesador de pagos, emails) — toma 1 día.
3. **Construir la primera versión funcional** en 4-6 semanas, empezando por: tienda → carrito → envío con CP → checkout con pago → email de confirmación con upsell → sistema dual de puntos.
4. **Lanzamiento suave** con los clientes actuales por email, midiendo conversiones, adopciones de cuenta, redenciones de puntos y envíos gratis durante 30 días antes de abrir al público general.

---

> **Una última cosa:** esta propuesta está escrita para que se entienda sin saber de tecnología. Detrás de cada capacidad hay decisiones técnicas que el equipo de desarrollo ya tiene claras y documentadas en `BackendPlan.md`. Si en algún momento querés ver el "cómo se hace" en detalle, o querés validar cada historia de usuario con criterios de aceptación, están disponibles en los documentos técnicos del proyecto.
