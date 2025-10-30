// ============================================
// SISTEMA GLOBAL DE DATOS - ULEAM
// Incluir este archivo en TODAS las páginas HTML:
// <script src="sistema-global.js"></script>
// ============================================

const SistemaULEAM = {
  // Claves de localStorage
  KEYS: {
    INVENTARIO: 'inventarioULEAM',
    USUARIOS: 'usuariosULEAM',
    ORDENES: 'ordenesMantenimiento',
    SESION: 'sesionActiva'
  },

  // ========== GESTIÓN DE INVENTARIO ==========
  Inventario: {
    inicializar() {
      if (!localStorage.getItem(SistemaULEAM.KEYS.INVENTARIO)) {
        const datosIniciales = [
          { id: 1, nombre: 'PC Docencia Lab 12', tipo: 'Computador', ubicacion: 'Bloque A — Lab 3', estado: 'Activo', serie: 'SER-PC-009812', responsable: 'Ana Pérez', fecha: '10/09/2025', marca: 'Dell', modelo: 'Optiplex 7090', valor: 1450.00, proveedor: 'CompuExpress', notas: 'Equipo principal de laboratorio.' },
          { id: 2, nombre: 'Proyector Aula Magna', tipo: 'Proyector', ubicacion: 'Aula Magna', estado: 'En reparación', serie: 'PRJ-77231', responsable: 'Carlos Ruiz', fecha: '05/10/2025', marca: 'Epson', modelo: 'EB-X51', valor: 730.00, proveedor: 'Epson Ecuador', notas: 'Pendiente repuesto lámpara.' },
          { id: 3, nombre: 'Impresora Adm. 2º piso', tipo: 'Impresora', ubicacion: 'Bloque B — Admin', estado: 'Activo', serie: 'HP-12A-5542', responsable: 'Diana Soto', fecha: '22/08/2025', marca: 'HP', modelo: 'LaserJet M404', valor: 890.00, proveedor: 'OfiPro', notas: 'Papel trabado resuelto.' },
          { id: 4, nombre: 'UPS Biblioteca', tipo: 'UPS', ubicacion: 'Biblioteca Central', estado: 'Dado de baja', serie: 'UPS-1500-AX9', responsable: 'Luis Cano', fecha: '01/07/2025', marca: 'APC', modelo: 'Smart-UPS 1500', valor: 560.00, proveedor: 'ElectroDigital', notas: 'Reciclado después de falla batería.' },
          { id: 5, nombre: 'Laptop Posgrado', tipo: 'Computador', ubicacion: 'Bloque C — Posgrado', estado: 'Activo', serie: 'LT-PGR-2025A', responsable: 'Marina Aguayo', fecha: '03/02/2025', marca: 'Lenovo', modelo: 'ThinkPad E14', valor: 1680.00, proveedor: 'Lenovo Ecuador', notas: 'Asignado a profesora visitante.' },
          { id: 6, nombre: 'Tablet Sala Docentes', tipo: 'Tablet', ubicacion: 'Bloque B — Sala Docentes', estado: 'Activo', serie: 'TB-1004-RV', responsable: 'Marcelo Tapia', fecha: '13/06/2025', marca: 'Samsung', modelo: 'Galaxy Tab A8', valor: 425.00, proveedor: 'DataZone', notas: 'Tablet para registro digital.' },
          { id: 7, nombre: 'Servidor Central', tipo: 'Servidor', ubicacion: 'DataCenter', estado: 'Activo', serie: 'SRV-CNTRL-004', responsable: 'Ing. Gonzalo Vélez', fecha: '08/01/2025', marca: 'HPE', modelo: 'ProLiant DL380', valor: 6500.00, proveedor: 'HPE Quito', notas: 'Servidor con backup diario.' },
          { id: 8, nombre: 'Router Principal', tipo: 'Router', ubicacion: 'Oficina de IT', estado: 'Activo', serie: 'RT-PR-2025B', responsable: 'Sofía Martínez', fecha: '15/03/2025', marca: 'Cisco', modelo: 'Catalyst 9200', valor: 1200.00, proveedor: 'Cisco Store', notas: 'Configurado para red interna.' }
        ];
        this.guardar(datosIniciales);
      }
    },

    obtenerTodos() {
      return JSON.parse(localStorage.getItem(SistemaULEAM.KEYS.INVENTARIO) || '[]');
    },

    guardar(inventario) {
      localStorage.setItem(SistemaULEAM.KEYS.INVENTARIO, JSON.stringify(inventario));
      this.notificarCambio();
    },

    agregar(equipo) {
      const inventario = this.obtenerTodos();
      equipo.id = inventario.length > 0 ? Math.max(...inventario.map(e => e.id)) + 1 : 1;
      equipo.fecha = equipo.fecha || new Date().toLocaleDateString("es-EC");
      inventario.push(equipo);
      this.guardar(inventario);
      return equipo;
    },

    actualizar(id, datos) {
      const inventario = this.obtenerTodos();
      const index = inventario.findIndex(e => e.id === id);
      if (index !== -1) {
        inventario[index] = { ...inventario[index], ...datos };
        this.guardar(inventario);
        return true;
      }
      return false;
    },

    eliminar(id) {
      const inventario = this.obtenerTodos();
      const nuevo = inventario.filter(e => e.id !== id);
      this.guardar(nuevo);
      return true;
    },

    obtenerEstadisticas() {
      const inventario = this.obtenerTodos();
      return {
        total: inventario.length,
        activos: inventario.filter(e => e.estado === 'Activo').length,
        enReparacion: inventario.filter(e => e.estado === 'En reparación').length,
        dadosDeBaja: inventario.filter(e => e.estado === 'Dado de baja').length,
        valorTotal: inventario.reduce((sum, e) => sum + (e.valor || 0), 0)
      };
    },

    notificarCambio() {
      window.dispatchEvent(new Event('inventarioCambiado'));
    }
  },

  // ========== GESTIÓN DE USUARIOS ==========
  Usuarios: {
    inicializar() {
      if (!localStorage.getItem(SistemaULEAM.KEYS.USUARIOS)) {
        const usuariosIniciales = [
          { id: 1, usuario: 'admin', password: '1234', nombre: 'Diana Soto Velasco', rol: 'Administrador', estado: 'Activo', email: 'diana.soto@uleam.edu.ec', fechaRegistro: '10/01/2025', ultimoAcceso: '-' },
          { id: 2, usuario: 'inventario', password: '1234', nombre: 'Ana Pérez Gómez', rol: 'Encargado de Inventario', estado: 'Activo', email: 'ana.perez@uleam.edu.ec', fechaRegistro: '15/03/2025', ultimoAcceso: '-' },
          { id: 3, usuario: 'mantenimiento', password: '1234', nombre: 'Carlos Ruiz Mendoza', rol: 'Técnico de Mantenimiento', estado: 'Activo', email: 'carlos.ruiz@uleam.edu.ec', fechaRegistro: '08/02/2025', ultimoAcceso: '-' },
          { id: 4, usuario: 'usuario', password: '1234', nombre: 'Luis Cano Torres', rol: 'Decanos, Directores y Profesores', estado: 'Activo', email: 'luis.cano@uleam.edu.ec', fechaRegistro: '22/09/2024', ultimoAcceso: '-' }
        ];
        this.guardar(usuariosIniciales);
      }
    },

    obtenerTodos() {
      return JSON.parse(localStorage.getItem(SistemaULEAM.KEYS.USUARIOS) || '[]');
    },

    guardar(usuarios) {
      localStorage.setItem(SistemaULEAM.KEYS.USUARIOS, JSON.stringify(usuarios));
    },

    validarLogin(usuario, password) {
      const usuarios = this.obtenerTodos();
      const encontrado = usuarios.find(u => u.usuario === usuario && u.password === password && u.estado === 'Activo');
      
      if (encontrado) {
        encontrado.ultimoAcceso = new Date().toLocaleString("es-EC");
        this.actualizar(encontrado.id, { ultimoAcceso: encontrado.ultimoAcceso });
        
        sessionStorage.setItem(SistemaULEAM.KEYS.SESION, JSON.stringify({
          id: encontrado.id,
          usuario: encontrado.usuario,
          nombre: encontrado.nombre,
          rol: encontrado.rol,
          email: encontrado.email
        }));
        return encontrado;
      }
      return null;
    },

    obtenerSesion() {
      const sesion = sessionStorage.getItem(SistemaULEAM.KEYS.SESION);
      return sesion ? JSON.parse(sesion) : null;
    },

    cerrarSesion() {
      sessionStorage.removeItem(SistemaULEAM.KEYS.SESION);
    },

    agregar(usuario) {
      const usuarios = this.obtenerTodos();
      usuario.id = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
      usuario.fechaRegistro = new Date().toLocaleDateString("es-EC");
      usuario.ultimoAcceso = '-';
      usuarios.push(usuario);
      this.guardar(usuarios);
      return usuario;
    },

    actualizar(id, datos) {
      const usuarios = this.obtenerTodos();
      const index = usuarios.findIndex(u => u.id === id);
      if (index !== -1) {
        usuarios[index] = { ...usuarios[index], ...datos };
        this.guardar(usuarios);
        return true;
      }
      return false;
    },

    eliminar(id) {
      const usuarios = this.obtenerTodos();
      const nuevo = usuarios.filter(u => u.id !== id);
      this.guardar(nuevo);
      return true;
    }
  },

  // ========== GESTIÓN DE ÓRDENES DE MANTENIMIENTO ==========
  Ordenes: {
    inicializar() {
      if (!localStorage.getItem(SistemaULEAM.KEYS.ORDENES)) {
        const ordenesIniciales = [
          {
            id: 'MT-2025-091',
            equipoId: 2,
            equipoNombre: 'Proyector Aula Magna',
            ubicacion: 'Aula Magna',
            estado: 'Pendiente',
            prioridad: 'Alta',
            tipo: 'Correctivo',
            asignado: 'Carlos Ruiz',
            descripcion: 'Lámpara del proyector no enciende. Se requiere reemplazo urgente para clases de esta semana.',
            fechaCreacion: '26/10/2025',
            fechaLimite: '28/10/2025',
            fechaCompletado: null,
            historial: [{ fecha: '26/10/2025 10:30', accion: 'Orden creada por Ana Pérez' }]
          },
          {
            id: 'MT-2025-089',
            equipoId: 1,
            equipoNombre: 'PC Docencia Lab 12',
            ubicacion: 'Bloque A — Lab 3',
            estado: 'En proceso',
            prioridad: 'Media',
            tipo: 'Preventivo',
            asignado: 'María López',
            descripcion: 'Actualización de sistema operativo y limpieza de hardware.',
            fechaCreacion: '24/10/2025',
            fechaLimite: '30/10/2025',
            fechaCompletado: null,
            historial: [
              { fecha: '24/10/2025 14:20', accion: 'Orden creada por Ana Pérez' },
              { fecha: '25/10/2025 09:15', accion: 'Iniciado por María López' }
            ]
          },
          {
            id: 'MT-2025-085',
            equipoId: 3,
            equipoNombre: 'Impresora Adm. 2º piso',
            ubicacion: 'Bloque B — Admin',
            estado: 'Completado',
            prioridad: 'Baja',
            tipo: 'Correctivo',
            asignado: 'Carlos Ruiz',
            descripcion: 'Atasco de papel resuelto.',
            fechaCreacion: '22/10/2025',
            fechaLimite: '27/10/2025',
            fechaCompletado: '25/10/2025',
            historial: [
              { fecha: '22/10/2025 11:00', accion: 'Orden creada por Diana Soto' },
              { fecha: '25/10/2025 16:45', accion: 'Completado por Carlos Ruiz' }
            ]
          }
        ];
        this.guardar(ordenesIniciales);
      }
    },

    obtenerTodas() {
      return JSON.parse(localStorage.getItem(SistemaULEAM.KEYS.ORDENES) || '[]');
    },

    guardar(ordenes) {
      localStorage.setItem(SistemaULEAM.KEYS.ORDENES, JSON.stringify(ordenes));
      this.notificarCambio();
    },

    agregar(orden) {
      const ordenes = this.obtenerTodas();
      const año = new Date().getFullYear();
      const numero = ordenes.length + 1;
      orden.id = `MT-${año}-${String(numero).padStart(3, '0')}`;
      orden.fechaCreacion = new Date().toLocaleDateString("es-EC");
      orden.fechaCompletado = null;
      orden.historial = [{
        fecha: new Date().toLocaleString("es-EC"),
        accion: `Orden creada por ${SistemaULEAM.Usuarios.obtenerSesion()?.nombre || 'Sistema'}`
      }];
      ordenes.push(orden);
      this.guardar(ordenes);
      return orden;
    },

    actualizar(id, datos) {
      const ordenes = this.obtenerTodas();
      const index = ordenes.findIndex(o => o.id === id);
      if (index !== -1) {
        ordenes[index] = { ...ordenes[index], ...datos };
        this.guardar(ordenes);
        return true;
      }
      return false;
    },

    cambiarEstado(id, nuevoEstado) {
      const ordenes = this.obtenerTodas();
      const orden = ordenes.find(o => o.id === id);
      if (orden) {
        orden.estado = nuevoEstado;
        if (nuevoEstado === 'Completado') {
          orden.fechaCompletado = new Date().toLocaleDateString("es-EC");
        }
        orden.historial.push({
          fecha: new Date().toLocaleString("es-EC"),
          accion: `Estado cambiado a: ${nuevoEstado}`
        });
        this.guardar(ordenes);
        return true;
      }
      return false;
    },

    agregarNota(id, nota) {
      const ordenes = this.obtenerTodas();
      const orden = ordenes.find(o => o.id === id);
      if (orden) {
        orden.historial.push({
          fecha: new Date().toLocaleString("es-EC"),
          accion: nota
        });
        this.guardar(ordenes);
        return true;
      }
      return false;
    },

    obtenerEstadisticas() {
      const ordenes = this.obtenerTodas();
      return {
        total: ordenes.length,
        pendientes: ordenes.filter(o => o.estado === 'Pendiente').length,
        enProceso: ordenes.filter(o => o.estado === 'En proceso').length,
        completadas: ordenes.filter(o => o.estado === 'Completado').length,
        canceladas: ordenes.filter(o => o.estado === 'Cancelado').length
      };
    },

    notificarCambio() {
      window.dispatchEvent(new Event('ordenesCambiadas'));
    }
  },

  // ========== UTILIDADES ==========
  Utils: {
    formatearMoneda(valor) {
      return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD'
      }).format(valor);
    },

    verificarSesion() {
      const sesion = SistemaULEAM.Usuarios.obtenerSesion();
      if (!sesion) {
        alert('⚠️ Debe iniciar sesión primero');
        window.location.href = 'Seleccion_usuario.html';
        return null;
      }
      return sesion;
    },

    cerrarSesionGlobal() {
      if (confirm('¿Desea cerrar sesión?')) {
        SistemaULEAM.Usuarios.cerrarSesion();
        window.location.href = 'Seleccion_usuario.html';
      }
    }
  },

  // ========== INICIALIZACIÓN AUTOMÁTICA ==========
  inicializar() {
    this.Inventario.inicializar();
    this.Usuarios.inicializar();
    this.Ordenes.inicializar();
    console.log('✅ Sistema ULEAM inicializado correctamente');
  }
};

// Auto-inicializar cuando se carga el script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SistemaULEAM.inicializar());
} else {
  SistemaULEAM.inicializar();
}

// Exportar para uso global
window.SistemaULEAM = SistemaULEAM;