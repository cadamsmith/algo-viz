// Package bubble_sort implements bubble sort as a stepwise visitor so that
// each comparison-and-possible-swap can be visualized.
//
// Time complexity:  O(n²)
// Space complexity: O(1)
package bubble_sort

// State is a snapshot of an in-progress sort.
type State struct {
	// Values is a copy of the current array, safe for the caller to retain.
	Values []int
	// I is the count of elements at the tail that are already in their final position.
	I int
	// J is the index of the next comparison: this step compares Values[J] and Values[J+1].
	J int
	// Done reports whether the sort has finished.
	Done bool
}

// Sorter performs bubble sort one comparison at a time.
type Sorter struct {
	initial []int
	values  []int
	i, j    int
	done    bool
}

// New returns a Sorter over a copy of values; the input slice is not retained.
func New(values []int) *Sorter {
	initial := make([]int, len(values))
	copy(initial, values)
	s := &Sorter{initial: initial}
	s.Reset()
	return s
}

// Reset restores the sorter to its initial values.
func (s *Sorter) Reset() {
	s.values = make([]int, len(s.initial))
	copy(s.values, s.initial)
	s.i = 0
	s.j = 0
	s.done = len(s.values) <= 1
}

// Step performs one comparison and (possibly) one swap, then advances the
// indices. Calling Step after Done() returns true is a no-op.
func (s *Sorter) Step() {
	if s.done {
		return
	}
	n := len(s.values)
	if s.values[s.j] > s.values[s.j+1] {
		s.values[s.j], s.values[s.j+1] = s.values[s.j+1], s.values[s.j]
	}
	s.j++
	if s.j >= n-1-s.i {
		s.j = 0
		s.i++
		if s.i >= n-1 {
			s.done = true
		}
	}
}

// Done reports whether the sort is complete.
func (s *Sorter) Done() bool {
	return s.done
}

// State returns a copy of the current state.
func (s *Sorter) State() State {
	out := make([]int, len(s.values))
	copy(out, s.values)
	return State{Values: out, I: s.i, J: s.j, Done: s.done}
}
