package bubble_sort

import (
	"sort"
	"testing"
)

func TestSortsKnownInput(t *testing.T) {
	s := New([]int{3, 1, 4, 1, 5, 9, 2, 6})
	for !s.Done() {
		s.Step()
	}
	want := []int{1, 1, 2, 3, 4, 5, 6, 9}
	if got := s.State().Values; !equal(got, want) {
		t.Fatalf("got %v, want %v", got, want)
	}
}

func TestEmptyInputIsDoneImmediately(t *testing.T) {
	s := New(nil)
	if !s.Done() {
		t.Fatal("expected empty input to be Done immediately")
	}
}

func TestSingleElementIsDoneImmediately(t *testing.T) {
	s := New([]int{42})
	if !s.Done() {
		t.Fatal("expected single-element input to be Done immediately")
	}
	if got := s.State().Values; len(got) != 1 || got[0] != 42 {
		t.Fatalf("expected [42], got %v", got)
	}
}

func TestResetRestoresInitial(t *testing.T) {
	initial := []int{5, 3, 1, 4, 2}
	s := New(initial)
	s.Step()
	s.Step()
	s.Reset()
	if got := s.State().Values; !equal(got, initial) {
		t.Fatalf("after Reset got %v, want %v", got, initial)
	}
	if s.Done() {
		t.Fatal("after Reset, Done should be false for n>1 input")
	}
}

func TestStepAfterDoneIsNoop(t *testing.T) {
	s := New([]int{2, 1})
	for !s.Done() {
		s.Step()
	}
	state := s.State()
	s.Step()
	if got := s.State(); !equal(got.Values, state.Values) || got.I != state.I || got.J != state.J {
		t.Fatalf("Step after Done changed state: %+v -> %+v", state, got)
	}
}

func TestMatchesStdlibForVariousInputs(t *testing.T) {
	cases := [][]int{
		{0},
		{2, 1},
		{1, 2, 3},
		{3, 3, 3, 3},
		{-1, -5, 2, 0, 4, -3},
		{10, 9, 8, 7, 6, 5, 4, 3, 2, 1},
	}
	for _, in := range cases {
		s := New(in)
		for !s.Done() {
			s.Step()
		}
		want := append([]int(nil), in...)
		sort.Ints(want)
		if got := s.State().Values; !equal(got, want) {
			t.Errorf("input %v: got %v, want %v", in, got, want)
		}
	}
}

func equal(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}
