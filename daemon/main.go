package main

import (
	"log"
	"net/http"
	"time"

	"antor-os-daemon/hardware"

	"github.com/gorilla/websocket"
)

// Configuración del upgrader de WebSocket, permitiendo conexiones del frontend (CORS)
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // En producción se debe restringir al origen de Vue
	},
}

// handleWebSocket gestiona las conexiones WebSocket entrantes en /ws
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error al actualizar la conexión a WebSocket:", err)
		return
	}
	defer conn.Close()

	log.Println("Cliente (User Space) conectado al Kernel WebSocket")

	// Canal para indicar la desconexión del cliente
	done := make(chan struct{})

	// Goroutine auxiliar: Necesaria para leer la conexión y detectar si el cliente cierra la pestaña/app
	go func() {
		defer close(done)
		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				log.Println("Cliente desconectado del WebSocket:", err)
				break
			}
		}
	}()

	// Ticker para enviar la telemetría cada 1 segundo
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	// Bucle infinito gestionando la telemetría o el cierre de la conexión
	for {
		select {
		case <-done:
			// El cliente se desconectó, finalizamos la Goroutine limpiamente
			log.Println("Deteniendo el envío de telemetría por desconexión.")
			return
		case <-ticker.C:
			// Extraer estadísticas físicas
			stats, err := hardware.GetStats()
			if err != nil {
				log.Println("Error al leer estadísticas del hardware:", err)
				continue
			}

			// Enviar como JSON al frontend Vue
			err = conn.WriteJSON(stats)
			if err != nil {
				log.Println("Error al enviar telemetría al cliente:", err)
				return // Se asume desconexión o error fatal, abortar
			}
		}
	}
}

func main() {
	// Exponer el endpoint para comunicación del OS Simulator
	http.HandleFunc("/ws", handleWebSocket)

	port := "8080"
	log.Printf("Iniciando el Kernel de Antor OS (Daemon) en http://localhost:%s", port)
	
	// Bloquea el hilo principal sirviendo la API
	err := http.ListenAndServe("localhost:"+port, nil)
	if err != nil {
		log.Fatalf("Error fatal al iniciar el servidor HTTP: %v", err)
	}
}
