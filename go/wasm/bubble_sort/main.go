//go:build js && wasm

// WASM entry point for the bubble_sort algorithm. Exposes:
//
//	bubbleSortInit(n int)   -> State    // create a sort over n random values
//	bubbleSortStep()        -> State    // advance one comparison
//	bubbleSortReset()       -> State    // restore to initial values
//	bubbleSortState()       -> State    // current snapshot
//
// State is a JS object: { values: number[], i: number, j: number, done: boolean }.
//
// Sets globalThis.bubbleSortReady = true once callbacks are registered, so the
// JS-side loader can wait for it before calling in.
package main

import (
	"math/rand"
	"syscall/js"

	"github.com/cadamsmith/algo-viz/go/algorithms/bubble_sort"
)

var sorter *bubble_sort.Sorter

func main() {
	js.Global().Set("bubbleSortInit", js.FuncOf(initFn))
	js.Global().Set("bubbleSortStep", js.FuncOf(stepFn))
	js.Global().Set("bubbleSortReset", js.FuncOf(resetFn))
	js.Global().Set("bubbleSortState", js.FuncOf(stateFn))
	js.Global().Set("bubbleSortReady", js.ValueOf(true))
	select {} // block forever — Go's main returning would tear down the runtime
}

func initFn(_ js.Value, args []js.Value) any {
	n := args[0].Int()
	values := make([]int, n)
	for i := range values {
		values[i] = rand.Intn(100)
	}
	sorter = bubble_sort.New(values)
	return stateValue()
}

func stepFn(_ js.Value, _ []js.Value) any {
	if sorter == nil {
		return js.Null()
	}
	sorter.Step()
	return stateValue()
}

func resetFn(_ js.Value, _ []js.Value) any {
	if sorter == nil {
		return js.Null()
	}
	sorter.Reset()
	return stateValue()
}

func stateFn(_ js.Value, _ []js.Value) any {
	if sorter == nil {
		return js.Null()
	}
	return stateValue()
}

func stateValue() js.Value {
	s := sorter.State()
	values := make([]any, len(s.Values))
	for i, v := range s.Values {
		values[i] = v
	}
	return js.ValueOf(map[string]any{
		"values": values,
		"i":      s.I,
		"j":      s.J,
		"done":   s.Done,
	})
}
