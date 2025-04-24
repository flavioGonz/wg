# Asistente WireGuard Compacto v2.4.1 por Infratec Networks

![Logo](https://infratec.com.uy/tickets/assets/images/backend/site_logo/67d850b5d31811742229685.png) <!-- Opcional: Añade una captura de pantalla aquí si quieres -->

Una herramienta web sencilla y potente para generar configuraciones de WireGuard®, con un enfoque especial en scripts para **MikroTik RouterOS**, pero también generando formatos estándar (`.conf`) y códigos QR.

**Toda la generación de claves y configuraciones se realiza localmente en tu navegador.** Ningún dato sensible se envía a servidores externos.

## ✨ Características Principales

*   **Asistente Intuitivo:** Interfaz guiada por pasos (wizard) para una fácil configuración.
*   **Enfoque MikroTik:** Genera scripts `.rsc` completos para servidores y clientes MikroTik.
*   **Compatibilidad Estándar:** Crea archivos `.conf` para clientes WireGuard oficiales (Windows, macOS, Linux, Android, iOS).
*   **Códigos QR:** Genera QR para importar fácilmente la configuración en móviles.
*   **Gestión de Claves Segura:** Genera pares de claves (pública/privada) y PSK localmente usando `wireguard.js`.
*   **Gestión de Clientes:** Añade, elimina y edita clientes (nombre/IP) de forma interactiva.
*   **Importar/Exportar Perfil:** Guarda y carga toda tu configuración en un archivo `.json`.
*   **Descargas Flexibles:** Descarga un ZIP completo, ZIP por cliente, o archivos individuales (`.conf`, `.rsc`, `.png`).
*   **Compartir Fácilmente:** Comparte configuraciones de clientes vía WhatsApp, Telegram, Slack (copiar) o Email.
*   **Interfaz Moderna:** Diseño limpio con tema oscuro basado en Bulma y FontAwesome.
*   **Procesamiento Local:** 100% del lado del cliente para mayor privacidad y seguridad.

## 🚀 Cómo Usar

1.  **Clona o Descarga:** Obtén los archivos del repositorio.
    ```bash
    git clone https://github.com/flavioGonz/wg.git
    cd wg
    ```
2.  **Asegura las Dependencias:** Verifica que los siguientes archivos estén presentes en la misma carpeta que `wcg-1.0.html`:
    *   `wireguard.js` (¡**Esencial** para la generación de claves!)
    *   `logo.png`
    *   `wg-private.png`
    *   `favicon.ico`
3.  **Abre el Asistente:** Abre el archivo `wcg-1.0.html` en tu navegador web preferido.
4.  **Sigue los Pasos:** Completa la información solicitada en cada paso del asistente:
    *   Datos del Servidor (IP/Dominio, Puerto, Nombre Interfaz MikroTik)
    *   Red VPN (Subred, IP inicial, Nº Clientes)
    *   Configuración Clientes (DNS, AllowedIPs)
    *   Llaves del Servidor (Genera nuevas o pega una existente)
    *   Revisa el Resumen.
5.  **Genera y Utiliza:** Haz clic en "Generar Configs" para ir a la pantalla de resultados. Desde allí puedes:
    *   Copiar los scripts para MikroTik.
    *   Descargar archivos `.conf`, `.rsc`, QR, o ZIPs.
    *   Guardar el perfil completo como `.json`.
    *   Gestionar los clientes (añadir, editar, eliminar, compartir).

## 🛠️ Tecnologías Utilizadas

*   [Vue.js](https://v2.vuejs.org/) (v2.6.14)
*   [Bulma CSS](https://bulma.io/) (v0.9.4)
*   [Font Awesome](https://fontawesome.com/) (v6.4.2)
*   [kjua](https://github.com/lrsjng/kjua) (Generación de Códigos QR)
*   [JSZip](https://stuk.github.io/jszip/) (Creación de Archivos ZIP)
*   [FileSaver.js](https://github.com/eligrey/FileSaver.js/) (Guardado de Archivos en Cliente)
*   `wireguard.js` (Librería para operaciones criptográficas de WireGuard - **IMPORTANTE: Asegúrate de tener una versión funcional y confiable de este archivo.**)

  ## 📸 Screenshots

Aquí tienes un vistazo del Asistente WireGuard Compacto en acción, paso a paso:

<table>
  <tr>
    <td width="50%" align="center">
      <p><b>Paso 1: Inicio</b></p>
      <img src="https://github.com/user-attachments/assets/4570d664-c102-46a1-baf0-7ed851f40767" alt="Paso 1: Pantalla de Inicio / Importar">
    </td>
    <td width="50%" align="center">
      <p><b>Paso 2: Datos Servidor</b></p>
      <img src="https://github.com/user-attachments/assets/dad36e03-c4d8-4758-9db5-3fbc7c6716b8" alt="Paso 2: Configuración del Servidor WireGuard">
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <p><b>Paso 3: Red VPN</b></p>
      <img src="https://github.com/user-attachments/assets/7d12e072-001d-40fb-bb82-642419fec781" alt="Paso 3: Definición de la Red VPN y Clientes Iniciales">
    </td>
    <td width="50%" align="center">
      <p><b>Paso 4: Configuración Clientes</b></p>
      <img src="https://github.com/user-attachments/assets/2e217497-e960-44b5-bb11-e773b4960a4d" alt="Paso 4: Configuración de DNS y AllowedIPs para Clientes">
    </td>
  </tr>
   <tr>
    <td width="50%" align="center">
      <p><b>Paso 5: Llaves Servidor</b></p>
      <img src="https://github.com/user-attachments/assets/2bb26d4d-7a58-4498-a070-3746a40a8e87" alt="Paso 5: Generación o Introducción de Llaves del Servidor">
    </td>
    <td width="50%" align="center">
      <p><b>Paso 6: Resumen</b></p>
      <img src="https://github.com/user-attachments/assets/cd141d16-9b73-45c0-abcb-eb28dfb1ac1d" alt="Paso 6: Resumen de la Configuración Antes de Generar">
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <p><b>Paso 7: Resultados</b></p>
      <img src="https://github.com/user-attachments/assets/6203b6ba-3496-4374-9b68-3d2ec2f75621" alt="Paso 7: Resultados con Script Servidor, Tabla de Clientes y Acciones">
    </td>
  </tr>
</table>

--- <!-- Opcional: Separador para la siguiente sección -->

## 🔒 Nota de Seguridad Importante

Este asistente está diseñado para funcionar **completamente en tu navegador**.
*   **No se envían datos a ningún servidor externo.**
*   Las claves privadas y PSK se generan y manejan localmente.
*   **Eres responsable** de guardar de forma segura los archivos exportados (`.json`), las claves privadas copiadas y las configuraciones generadas. Trata la clave privada del servidor y los archivos `.json` como información altamente confidencial.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Si encuentras un error o tienes una sugerencia, por favor abre un *issue* en el repositorio. Si quieres contribuir con código, por favor abre un *pull request*.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles (***Nota:** Asegúrate de añadir un archivo LICENSE, por ejemplo, MIT*).

## 👤 Autor

*   **Flavio González by Infratec Networks**
*   Sitio Web: [https://infratec.com.uy](https://infratec.com.uy/wg)
*   
## 📝 Licencia

*   **MT Licence**
*   Copyright (c) 2025 Flavio Gonzalez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell      
copies of the Software, and to permit persons to whom the Software is         
furnished to do so, subject to the following conditions:                       

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.                                

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR    
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,      
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE   
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER        
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.

---

*WireGuard® es una marca registrada de Jason A. Donenfeld.*
