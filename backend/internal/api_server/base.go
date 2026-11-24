package api_server

// Our Registrar interface which will force pointer types to implement the following
// methods.
type Registrar interface {
	RegisterWebsocketHandlers()
}

// Debug needs to have the methods mentioned in Registrar, regardless of which
// file they are defined in. The receiver methods for Debug just need to exist.
var _ Registrar = (*DebugHandler)(nil)
