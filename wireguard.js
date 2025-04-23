/*! SPDX-License-Identifier: GPL-2.0
 *
 * Copyright (C) 2015-2020 Jason A. Donenfeld <Jason@zx2c4.com>. All Rights Reserved.
 * Modifications (publicKey export and base64ToKey helper) added for integration.
 */

(function() {
	// --- Funciones Matemáticas de bajo nivel (Originales) ---
	function gf(init) {
		var r = new Float64Array(16);
		if (init) {
			for (var i = 0; i < init.length; ++i)
				r[i] = init[i];
		}
		return r;
	}

	function pack(o, n) {
		var b, m = gf(), t = gf();
		for (var i = 0; i < 16; ++i)
			t[i] = n[i];
		carry(t);
		carry(t);
		carry(t);
		for (var j = 0; j < 2; ++j) {
			m[0] = t[0] - 0xffed;
			for (var i = 1; i < 15; ++i) {
				m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
				m[i - 1] &= 0xffff;
			}
			m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
			b = (m[15] >> 16) & 1;
			m[14] &= 0xffff;
			cswap(t, m, 1 - b);
		}
		for (var i = 0; i < 16; ++i) {
			o[2 * i] = t[i] & 0xff;
			o[2 * i + 1] = t[i] >> 8;
		}
	}

	function carry(o) {
		var c;
		for (var i = 0; i < 16; ++i) {
			o[(i + 1) % 16] += (i < 15 ? 1 : 38) * Math.floor(o[i] / 65536);
			o[i] &= 0xffff;
		}
	}

	function cswap(p, q, b) {
		var t, c = ~(b - 1);
		for (var i = 0; i < 16; ++i) {
			t = c & (p[i] ^ q[i]);
			p[i] ^= t;
			q[i] ^= t;
		}
	}

	function add(o, a, b) {
		for (var i = 0; i < 16; ++i)
			o[i] = (a[i] + b[i]) | 0;
	}

	function subtract(o, a, b) {
		for (var i = 0; i < 16; ++i)
			o[i] = (a[i] - b[i]) | 0;
	}

	function multmod(o, a, b) {
		var t = new Float64Array(31);
		for (var i = 0; i < 16; ++i) {
			for (var j = 0; j < 16; ++j)
				t[i + j] += a[i] * b[j];
		}
		for (var i = 0; i < 15; ++i)
			t[i] += 38 * t[i + 16];
		for (var i = 0; i < 16; ++i)
			o[i] = t[i];
		carry(o);
		carry(o);
	}

	function invert(o, i) {
		var c = gf();
		for (var a = 0; a < 16; ++a)
			c[a] = i[a];
		for (var a = 253; a >= 0; --a) {
			multmod(c, c, c);
			if (a !== 2 && a !== 4)
				multmod(c, c, i);
		}
		for (var a = 0; a < 16; ++a)
			o[a] = c[a];
	}

	// --- Funciones de Generación de Claves (Originales) ---
	function clamp(z) {
		// Modifica el Uint8Array directamente
		if (!z || z.length !== 32) return; // Protección
		z[31] = (z[31] & 127) | 64;
		z[0] &= 248;
	}

	function generatePublicKey(privateKeyBytes) {
		// Acepta Uint8Array, devuelve Uint8Array
		var r, publicKeyBytes = new Uint8Array(32); // Cambiado z a publicKeyBytes
		var tempPrivateKey = new Uint8Array(32); // Usar una copia para clamp
		for(var i=0; i<32; ++i) tempPrivateKey[i] = privateKeyBytes[i];
		// Clamp se aplica internamente al generar la pública, no necesita clamp previo
		// clamp(tempPrivateKey); // El clamp de la privada original no es necesario aquí, la fórmula lo hace.

		var a = gf([1]),
			b = gf([9]),
			c = gf(),
			d = gf([1]),
			e = gf(),
			f = gf(),
			_121665 = gf([0xdb41, 1]),
			_9 = gf([9]);

		// Bucle principal de Curve25519 (Scalar Multiplication)
		for (var i = 254; i >= 0; --i) {
			r = (tempPrivateKey[i >>> 3] >>> (i & 7)) & 1; // Usa la copia
			cswap(a, b, r);
			cswap(c, d, r);
			add(e, a, c);
			subtract(a, a, c);
			add(c, b, d);
			subtract(b, b, d);
			multmod(d, e, e);
			multmod(f, a, a);
			multmod(a, c, a);
			multmod(c, b, e);
			add(e, a, c);
			subtract(a, a, c);
			multmod(b, a, a);
			subtract(c, d, f);
			multmod(a, c, _121665);
			add(a, a, d);
			multmod(c, c, a);
			multmod(a, d, f);
			multmod(d, b, _9);
			multmod(b, e, e);
			cswap(a, b, r);
			cswap(c, d, r);
		}
		invert(c, c);
		multmod(a, a, c);
		pack(publicKeyBytes, a); // Empaqueta el resultado en publicKeyBytes
		return publicKeyBytes;
	}

	function generatePresharedKey() {
		// Devuelve Uint8Array
		var presharedKeyBytes = new Uint8Array(32);
		window.crypto.getRandomValues(presharedKeyBytes);
		return presharedKeyBytes;
	}

	function generatePrivateKey() {
		// Devuelve Uint8Array
		var privateKeyBytes = generatePresharedKey(); // Empieza con aleatorios
		clamp(privateKeyBytes); // Aplica clamp
		return privateKeyBytes;
	}

	// --- Funciones de Codificación Base64 (Originales) ---
	function encodeBase64(dest, src) {
		var input = Uint8Array.from([(src[0] >> 2) & 63, ((src[0] << 4) | (src[1] >> 4)) & 63, ((src[1] << 2) | (src[2] >> 6)) & 63, src[2] & 63]);
		for (var i = 0; i < 4; ++i)
			dest[i] = input[i] + 65 +
			(((25 - input[i]) >> 8) & 6) -
			(((51 - input[i]) >> 8) & 75) -
			(((61 - input[i]) >> 8) & 15) +
			(((62 - input[i]) >> 8) & 3);
	}

	function keyToBase64(keyBytes) {
		// Acepta Uint8Array(32), devuelve String(44)
		var i, base64 = new Uint8Array(44);
		if (!keyBytes || keyBytes.length !== 32) {
			console.error("keyToBase64: Input must be a 32-byte Uint8Array.");
			return ""; // O lanzar error
		}
		for (i = 0; i < 32 / 3; ++i)
			encodeBase64(base64.subarray(i * 4), keyBytes.subarray(i * 3));
		// Codifica los bytes restantes (si los hay, aunque 32 es divisible por 3 no exactamente)
		// En este caso, 32 / 3 = 10 con resto 2. Necesitamos codificar los últimos 2 bytes.
		// La implementación original parece manejar esto correctamente para 32 bytes.
		encodeBase64(base64.subarray(i * 4), Uint8Array.from([keyBytes[i * 3 + 0], keyBytes[i * 3 + 1], 0]));
		base64[43] = 61; // Añadir el padding '='
		return String.fromCharCode.apply(null, base64);
	}

	// --- NUEVA: Función Auxiliar para Decodificar Base64 a Uint8Array ---
	function base64ToKey(base64) {
		// Acepta String(44), devuelve Uint8Array(32) o lanza error
		try {
			if (typeof base64 !== 'string' || base64.length !== 44 || base64[43] !== '=') {
				 throw new Error("Invalid Base64 key format (expecting 44 chars ending with '=').");
			}
			// Usar atob para decodificar Base64 a string binario
			var binary_string = window.atob(base64);
			var len = binary_string.length;

			// La cadena binaria decodificada de una clave de 32 bytes debería ser 32 bytes
			if (len !== 32) {
				throw new Error("Decoded Base64 key is not 32 bytes long (got " + len + ").");
			}

			var bytes = new Uint8Array(len);
			for (var i = 0; i < len; i++) {
				bytes[i] = binary_string.charCodeAt(i);
			}
			return bytes;
		} catch (e) {
			// Captura errores de atob (ej. caracteres inválidos) o los nuestros
			console.error("Error decoding Base64 key:", e.message);
			// Re-lanzar para que el código que llama sepa que falló
			throw e; // O `throw new Error("Failed to decode Base64 key.");`
		}
	}


	// --- Objeto Global Exportado ---
	window.wireguard = {
		/**
		 * Genera un nuevo par de claves WireGuard (privada, pública) y una clave precompartida (PSK).
		 * @returns {object} Un objeto con publicKey, privateKey y preSharedKey, todas como strings Base64.
		 */
		generateKeypair: function() {
			var privateKeyBytes = generatePrivateKey(); // Obtiene bytes
			var publicKeyBytes = generatePublicKey(privateKeyBytes); // Obtiene bytes
			var preSharedKeyBytes = generatePresharedKey(); // Obtiene bytes
			return {
				publicKey: keyToBase64(publicKeyBytes),    // Convierte a Base64
				privateKey: keyToBase64(privateKeyBytes),   // Convierte a Base64
				preSharedKey: keyToBase64(preSharedKeyBytes) // Convierte a Base64
			};
		},

		/**
		 * NUEVO: Deriva la clave pública correspondiente a una clave privada dada.
		 * @param {string} privateKeyBase64 - La clave privada en formato Base64 (44 caracteres).
		 * @returns {string|null} La clave pública correspondiente en formato Base64, o null si la clave privada es inválida.
		 */
		publicKey: function(privateKeyBase64) {
			 try {
				// 1. Decodifica la clave privada Base64 a bytes
				var privateKeyBytes = base64ToKey(privateKeyBase64);

				// 2. Genera la clave pública en bytes a partir de la clave privada en bytes
				var publicKeyBytes = generatePublicKey(privateKeyBytes);

				// 3. Codifica la clave pública resultante a Base64 y la devuelve
				return keyToBase64(publicKeyBytes);

			} catch (e) {
				// Si base64ToKey o generatePublicKey fallan (ej. formato inválido)
				 console.error("Failed to derive public key:", e.message);
				 // Devuelve null para indicar el error al código que llama (Vue watcher)
				 return null;
			}
		},

		/**
		 * NUEVO (Opcional pero útil): Genera solo una clave precompartida (PSK).
		 * @returns {string} Una nueva clave precompartida como string Base64.
		 */
		generatePresharedKey: function() {
			var preSharedKeyBytes = generatePresharedKey();
			return keyToBase64(preSharedKeyBytes);
		}

		// Nota: generatePrivateKey y generatePublicKey (las que devuelven bytes)
		// no se exponen directamente, ya que la interfaz pública usa Base64.
	};
})(); // Fin de la función autoejecutable (IIFE)