# 🐍 Python Language Reference (Skeleton)

This is the unified dictionary skeleton for Python builtins, keywords, and operators.

---

## Table of Contents

- [Builtins](#builtins)
  

  - [Constants](#constants)

  - [Core Types](#core-types)

  - [Functions](#functions)
    - [Mechanical](#mechanical)
    - [Iteration](#iteration)
    - [IO](#io)
    - [Introspection](#introspection)
    - [Object](#object)
    - [StringFormat](#stringformat)
    - [Compile/Eval](#compile-eval)
    - [Async](#async)

  - [Exceptions & Warnings](#exceptions-warnings)

- [Keywords](#keywords)

- [Operators & Delimiters](#operators-delimiters)

---

<a name="builtins"></a><a id="builtins"></a>
## 🐍 Python Builtins


## Constants

### False

**Description**: The boolean value for "no" or "off". `False` is a singleton of type `bool` (which is a subclass of `int`). In conditions, `False` is treated as falsey. Many other values are also falsey (like `0`, `0.0`, `''`, `[]`, `{}`, `set()`, `None`), but they are not the same object as `False`.

**Example**:

```python
print(False)
print(isinstance(False, bool))
print(False == 0, False is 0)  # equal in value to 0, but not the same object

if False:
    print("hidden")
else:
    print("shown")

# results:
# False
# True
# True False
# shown
```

### True

**Description**: The boolean value for "yes" or "on". `True` is a singleton of type `bool` (a subclass of `int`). In conditions, `True` is treated as truthy. Many other values are also truthy (most non-empty objects and non-zero numbers), but they are not the same object as `True`.

**Example**:

```python
print(True)
print(isinstance(True, bool))
print(True == 1, True is 1)  # equal in value to 1, but not the same object

if True:
    print("runs")

# results:
# True
# True
# True False
# runs
```

### None

**Description**: The single value that represents “no value” or “nothing here”. `None` is the only instance of `NoneType`. Functions return `None` if they do not explicitly return something. Compare with `is` (identity), not `==`.

**Example**:

```python
value = None
print(value is None)
print(bool(None))  # None is falsey

def do_nothing():
    pass

print(do_nothing() is None)

# results:
# True
# False
# True
```

### Ellipsis

**Description**: The special singleton value written as `...`. Its type is `ellipsis`. It’s used by some libraries (like NumPy) for advanced slicing and is commonly used as a lightweight placeholder in code or stubs.

**Example**:

```python
print(Ellipsis is ...)
print(type(...))

def stub_function():
    return ...  # placeholder value

print(stub_function())

# results:
# True
# <class 'ellipsis'>
# Ellipsis
```

### NotImplemented

**Description**: A special singleton that binary special methods (like `__add__`, `__eq__`, etc.) should return to say “I don’t support this operation with that other type.” Python will then try the reflected method on the other object, and if neither supports it, a `TypeError` is raised. Do not confuse with `NotImplementedError` (an exception).

**Example**:

```python
class Adder:
    def __add__(self, other):
        if isinstance(other, int):
            return other + 10
        return NotImplemented  # tell Python to try the other operand's __radd__

a = Adder()
print(a + 5)

try:
    print(a + 2.5)  # float doesn't know how to add Adder either
except TypeError as e:
    print(type(e).__name__)

# results:
# 15
# TypeError
```


## Core Types

### bool

**Description**: The boolean type with two values: `True` and `False`. `bool` is a subclass of `int`, so `True == 1` and `False == 0`, though identities differ. Used for conditions, comparisons, and logical operations.

**Example**:

```python
print(isinstance(True, bool), isinstance(False, bool))
print(True + True, False + 5)
print(bool(0), bool(3), bool(""), bool("hi"))

# results:
# True True
# 2 5
# False True False True
```

### bytearray

**Description**: A mutable sequence of bytes (integers 0–255). Good for in-place modifications of binary data (e.g., I/O buffers). Unlike `bytes`, contents can be changed.

**Example**:

```python
barr = bytearray(b"hello")
barr[0] = ord('H')
barr.append(33)  # '!' -> 33
print(barr, barr.decode())

# results:
# bytearray(b'Hello!') Hello!
```

### bytes

**Description**: An immutable sequence of bytes. Often used for binary files, network data, or encoded text (e.g., UTF-8). Cannot be changed after creation.

**Example**:

```python
data = b"caf\xc3\xa9"  # "café" in UTF-8
print(data)
print(data.decode('utf-8'))

# results:
# b'caf\xc3\xa9'
# café
```

### complex

**Description**: Numbers with a real and imaginary part, written as `a+bj` (note the `j`). Useful in math, signal processing, and scientific computing.

**Example**:

```python
z = 3 + 4j
print(z.real, z.imag)
print(abs(z))  # magnitude
print((1+2j) * (2-3j))

# results:
# 3.0 4.0
# 5.0
# (8+1j)
```

### dict

**Description**: A mapping of keys to values. Keys are unique and must be hashable (e.g., `str`, `int`, `tuple` of immutables). Insert order is preserved.

**Example**:

```python
user = {"name": "Ada", "age": 36}
user["job"] = "Engineer"
print(user["name"], list(user.keys()))

# results:
# Ada ['name', 'age', 'job']
```

### float

**Description**: Double-precision floating-point number (IEEE 754). Represents real numbers with decimals. Beware of rounding errors for some decimal fractions.

**Example**:

```python
print(0.1 + 0.2)
print(round(0.1 + 0.2, 10))

# results:
# 0.30000000000000004
# 0.3
```

### frozenset

**Description**: An immutable set. Useful as dictionary keys or set elements when you need a hashable collection of unique items.

**Example**:

```python
fs = frozenset([1, 2, 2, 3])
print(fs)
print({fs: "immutable set"}[fs])

# results:
# frozenset({1, 2, 3})
# immutable set
```

### int

**Description**: Integer numbers of arbitrary size (limited by memory). Supports math operations, bit operations, and base conversions.

**Example**:

```python
n = 12345678901234567890
print(n.bit_length())
print(int("ff", 16))  # hex to int

# results:
# 64  # exact bit length may vary with the number above
# 255
```

### list

**Description**: An ordered, mutable sequence. Supports indexing, slicing, and methods like `append`, `pop`, and `sort`. Can hold mixed types.

**Example**:

```python
nums = [3, 1, 2]
nums.append(5)
nums.sort()
print(nums, nums[0], nums[-1])

# results:
# [1, 2, 3, 5] 1 5
```

### memoryview

**Description**: A zero-copy “view” of a bytes-like object (e.g., `bytes`, `bytearray`). Lets you slice and, if the underlying object is mutable, modify data without creating new copies.

**Example**:

```python
barr = bytearray(b"hello")
mv = memoryview(barr)
mv[0] = ord('H')  # modify through the view
print(barr)
print(bytes(mv[1:4]))  # view slicing without copying the base

# results:
# bytearray(b'Hello')
# b'ell'
```

### object

**Description**: The base class for all new-style classes in Python. Every object ultimately inherits from `object` and thus shares some minimal default behavior.

**Example**:

```python
print(isinstance(42, object), isinstance([], object), isinstance(object(), object))

class Foo:  # implicitly inherits from object
    pass

f = Foo()
print(isinstance(f, object), issubclass(Foo, object))

# results:
# True True True
# True True
```

### range

**Description**: An immutable sequence of numbers defined by start, stop, and step. Efficiently represents arithmetic progressions without storing all numbers at once.

**Example**:

```python
r = range(2, 10, 2)
print(list(r))
print(r[1], r[-1])
print(len(r))

# results:
# [2, 4, 6, 8]
# 4 8
# 4
```

### set

**Description**: An unordered collection of unique, hashable items. Supports fast membership tests and set algebra like union, intersection, and difference.

**Example**:

```python
a = {1, 2, 2, 3}
b = {3, 4}
print(a)                 # duplicates removed
print(a | b, a & b, a - b)

# results:
# {1, 2, 3}
# {1, 2, 3, 4} {3} {1, 2}
```

### slice

**Description**: Represents a slice specification with `start`, `stop`, and `step`. Useful for programmatic slicing on sequences and for code clarity.

**Example**:

```python
s = slice(1, 5, 2)
data = [0, 1, 2, 3, 4, 5, 6]
print(data[s])
print(s.start, s.stop, s.step)

# results:
# [1, 3]
# 1 5 2
```

### str

**Description**: The text type for Unicode strings. Supports slicing, searching, and many helpful methods like `upper`, `lower`, `split`, and `join`.

**Example**:

```python
text = "Hello, world"
print(len(text), text.upper())
print("->".join(["a", "b", "c"]))

# results:
# 12 HELLO, WORLD
# a->b->c
```

### tuple

**Description**: An ordered, immutable sequence. Efficient for fixed collections of items. Supports indexing, slicing, and unpacking.

**Example**:

```python
t = (1, "a", 3.0)
x, y, z = t
print(t, x, y, z)
print(t + (4,), t * 2)

# results:
# (1, 'a', 3.0) 1 a 3.0
# (1, 'a', 3.0, 4) (1, 'a', 3.0, 1, 'a', 3.0)
```

### type

**Description**: The metaclass of most Python classes. Called with one argument, returns an object’s type. Called with three arguments, creates a new class dynamically.

**Example**:

```python
print(type(3) is int)

def _init(self, x, y):
    self.x = x
    self.y = y

Point = type("Point", (object,), {"__init__": _init})
p = Point(2, 5)
print(isinstance(p, Point), p.x, p.y)

# results:
# True
# True 2 5
```


<a name="functions"></a><a id="functions"></a>
<a name="mechanical"></a><a id="mechanical"></a>
### Mechanical
### abs

**Description**: Returns the absolute value of a number. For integers and floats, it’s the distance from zero. For complex numbers, it returns the magnitude (length) of the vector.

**Example**:

```python
print(abs(-7))
print(abs(3.5))
print(abs(3+4j))  # magnitude of the complex number

# results:
# 7
# 3.5
# 5.0
```

### divmod

**Description**: Takes two numbers and returns a tuple `(quotient, remainder)` using integer division. Useful for splitting a number into parts.

**Example**:

```python
print(divmod(9, 2))
print(divmod(20, 6))

# results:
# (4, 1)
# (3, 2)
```

### pow

**Description**: Raises a number to a power. With three arguments, `pow(base, exp, mod)` computes `(base ** exp) % mod` efficiently.

**Example**:

```python
print(pow(2, 5))        # 2**5
print(pow(2, 5, 3))     # (2**5) % 3

# results:
# 32
# 2
```

### round

**Description**: Rounds a number to the nearest integer, or to `ndigits` decimal places if provided. Uses “banker’s rounding” for .5 cases.

**Example**:

```python
print(round(3.14159, 2))
print(round(7/2))

# results:
# 3.14
# 4
```

### sum

**Description**: Adds numbers in an iterable, optionally starting from a `start` value. Works with any iterable of numbers.

**Example**:

```python
print(sum([1, 2, 3]))
print(sum((1, 2, 3), 10))  # start value 10

# results:
# 6
# 16
```

### max

**Description**: Returns the largest item from an iterable, or the largest of two or more arguments. Accepts a `key` function to customize comparisons.

**Example**:

```python
print(max([3, 1, 5, 2]))
words = ["pear", "apple", "banana"]
print(max(words, key=len))  # by length

# results:
# 5
# banana
```

### min

**Description**: Returns the smallest item from an iterable, or the smallest of two or more arguments. Accepts a `key` function to customize comparisons.

**Example**:

```python
print(min([3, 1, 5, 2]))
words = ["pear", "apple", "banana"]
print(min(words, key=len))  # by length

# results:
# 1
# pear
```


<a name="iteration"></a>
### Iteration
### all

**Description**: Returns `True` if every element of the iterable is truthy (or if the iterable is empty). Stops early on the first falsey item.

**Example**:

```python
print(all([True, True, 1]))
print(all([True, 0, 1]))
print(all([]))

# results:
# True
# False
# True
```

### any

**Description**: Returns `True` if any element of the iterable is truthy. Returns `False` for an empty iterable.

**Example**:

```python
print(any([0, False, None, 3]))
print(any([0, False]))
print(any([]))

# results:
# True
# False
# False
```

### enumerate

**Description**: Adds an index (counter) to an iterable, yielding pairs `(index, item)`. Helpful when you need positions while looping.

**Example**:

```python
fruits = ['apple', 'banana', 'cherry']
for idx, fruit in enumerate(fruits):
    print(idx, fruit)

# results:
# 0 apple
# 1 banana
# 2 cherry
```

### filter

**Description**: Keeps items for which the function returns `True`. Produces an iterator; wrap with `list()` to see all results.

**Example**:

```python
numbers = [1, 2, 3, 4, 5]
even_numbers = filter(lambda x: x % 2 == 0, numbers)
print(list(even_numbers))

# results:
# [2, 4]
```

### iter

**Description**: Returns an iterator from an iterable (like a list) or from a callable with a sentinel. Iterators produce items one by one with `next()`.

**Example**:

```python
data = [10, 20, 30]
it = iter(data)
print(next(it), next(it))

# results:
# 10 20
```

### map

**Description**: Applies a function to each item of one or more iterables, yielding the transformed results lazily.

**Example**:

```python
numbers = [1, 2, 3, 4]
squared = map(lambda x: x * x, numbers)
print(list(squared))

# results:
# [1, 4, 9, 16]
```

### next

**Description**: Gets the next item from an iterator. Optionally provide a default to avoid `StopIteration` when the iterator is exhausted.

**Example**:

```python
it = iter([1, 2])
print(next(it))
print(next(it))
print(next(it, 'done'))

# results:
# 1
# 2
# done
```

### reversed

**Description**: Returns a reverse iterator over a sequence. The object must support random access or define a `__reversed__` method.

**Example**:

```python
for x in reversed([1, 2, 3]):
    print(x)

# results:
# 3
# 2
# 1
```

### sorted

**Description**: Returns a new sorted list from any iterable. Supports `key` functions for custom sorting and `reverse=True` for descending order.

**Example**:

```python
nums = [3, 1, 4, 1]
print(sorted(nums))
print(sorted(['pear', 'apple', 'banana'], key=len))
print(sorted(nums, reverse=True))

# results:
# [1, 1, 3, 4]
# ['pear', 'apple', 'banana']
# [4, 3, 1, 1]
```

### zip

**Description**: Aggregates items from multiple iterables into tuples, stopping at the shortest. Useful for pairing related sequences.

**Example**:

```python
names = ['Alice', 'Bob']
ages = [25, 30]
print(list(zip(names, ages)))

# results:
# [('Alice', 25), ('Bob', 30)]
```


<a name="io"></a>
### IO
### input

**Description**: Reads a line from standard input and returns it as a string (without the trailing newline). Optionally displays a prompt.

**Example**:

```python
# name = input("Enter your name: ")
# print(f"Hello, {name}!")

# results:
# Enter your name: John
# Hello, John!
```

### print

**Description**: Writes text to standard output, converting objects to strings. Supports `sep` (separator), `end` (line ending), `file`, and `flush` parameters.

**Example**:

```python
print("A", "B", "C", sep=", ")
print("no newline", end="...")
print("done")

# results:
# A, B, C
# no newline...done
```

### open

**Description**: Opens a file and returns a file object. Use modes like `'r'` (read), `'w'` (write, truncate), `'a'` (append), and `'b'` (binary). Prefer using a `with` block so the file closes automatically.

**Example**:

```python
# write
with open('example.txt', 'w', encoding='utf-8') as f:
    f.write('Hello, world!')

# read
with open('example.txt', 'r', encoding='utf-8') as f:
    content = f.read()
print(content)

# results:
# Hello, world!
```


<a name="introspection"></a>
### Introspection
### callable

**Description**: Returns `True` if the object looks callable (like functions, methods, and instances defining `__call__`). Otherwise returns `False`.

**Example**:

```python
def f():
    pass

print(callable(f))
print(callable(42))

# results:
# True
# False
```

### dir

**Description**: Lists valid attributes for an object. With no argument, lists names in the current scope.

**Example**:

```python
print('append' in dir([]))
print(len(dir(str)) > 10)

# results:
# True
# True
```

### getattr

**Description**: Gets an attribute by name from an object. Accepts a default to return if the attribute does not exist instead of raising `AttributeError`.

**Example**:

```python
class Person:
    species = 'Human'

p = Person()
print(getattr(p, 'species'))
print(getattr(p, 'age', 'unknown'))

# results:
# Human
# unknown
```

### globals

**Description**: Returns a dictionary representing the current global symbol table (module-level variables).

**Example**:

```python
g = globals()
print(isinstance(g, dict))
print('__name__' in g)

# results:
# True
# True
```

### hasattr

**Description**: Checks whether an object has an attribute with the given name. Returns `True` or `False`.

**Example**:

```python
class Box:
    def __init__(self):
        self.size = 3

b = Box()
print(hasattr(b, 'size'))
print(hasattr(b, 'color'))

# results:
# True
# False
```

### id

**Description**: Returns the “identity” of an object, which is an integer unique to the object during its lifetime.

**Example**:

```python
a = object()
b = a
c = object()
print(id(a) == id(b), id(a) == id(c))

# results:
# True False
```

### isinstance

**Description**: Checks whether an object is an instance of a class or any subclass thereof. Accepts a tuple of classes to check against multiple types.

**Example**:

```python
print(isinstance(5, int))
print(isinstance(True, (int, bool)))

# results:
# True
# True
```

### issubclass

**Description**: Checks whether a class is a subclass of another class or any of its subclasses.

**Example**:

```python
class A: pass
class B(A): pass
print(issubclass(B, A), issubclass(A, B))

# results:
# True False
```

### len

**Description**: Returns the number of items in a container (like lists, strings, dicts). Calls the object’s `__len__` method.

**Example**:

```python
print(len([1, 2, 3]))
print(len("hello"))

# results:
# 3
# 5
```

### locals

**Description**: Returns a dictionary of the current local symbol table. Inside a function, includes the function’s local variables.

**Example**:

```python
def demo():
    x = 2
    y = 3
    d = locals()
    return sorted(d.keys())

print(demo())

# results:
# ['d', 'x', 'y']
```

### setattr

**Description**: Sets an attribute on an object by name (creates it if it doesn’t exist).

**Example**:

```python
class Empty: pass
e = Empty()
setattr(e, 'name', 'Ada')
print(e.name)

# results:
# Ada
```

### vars

**Description**: Returns the `__dict__` attribute of an object (a dict of its writable attributes). With no argument, acts like `locals()`.

**Example**:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(2, 5)
print(vars(p))

# results:
# {'x': 2, 'y': 5}
```

### type

**Description**: With one argument, returns an object’s type. With three arguments, creates a new class: `type(name, bases, namespace)`.

**Example**:

```python
print(type(5) is int)
A = type('A', (), {'x': 1})
a = A()
print(isinstance(a, A), a.x)

# results:
# True
# True 1
```


<a name="object"></a>
### Object
### classmethod

**Description**: Decorator that makes a method receive the class (`cls`) instead of an instance (`self`). Useful for alternative constructors and class-wide operations.

**Example**:

```python
class Person:
    def __init__(self, name):
        self.name = name

    @classmethod
    def from_first_last(cls, first, last):
        return cls(f"{first} {last}")

p = Person.from_first_last('Ada', 'Lovelace')
print(p.name)

# results:
# Ada Lovelace
```

### property

**Description**: Creates managed attributes. Lets you define getters/setters with attribute access syntax, enabling validation or computed values.

**Example**:

```python
class Celsius:
    def __init__(self, temp):
        self._temp = temp

    @property
    def temp(self):
        return self._temp

    @temp.setter
    def temp(self, value):
        if value < -273.15:
            raise ValueError('below absolute zero')
        self._temp = value

c = Celsius(0)
print(c.temp)
c.temp = 25
print(c.temp)

# results:
# 0
# 25
```

### staticmethod

**Description**: Decorator that marks a method as a plain function stored on a class. It does not receive `self` or `cls` automatically.

**Example**:

```python
class Math:
    @staticmethod
    def add(x, y):
        return x + y

print(Math.add(5, 3))

# results:
# 8
```

### super

**Description**: Returns a proxy to delegate attribute access to a parent class. Commonly used to call parent methods in overrides.

**Example**:

```python
class Parent:
    def greet(self):
        print('Hello from Parent')

class Child(Parent):
    def greet(self):
        super().greet()
        print('Hello from Child')

Child().greet()

# results:
# Hello from Parent
# Hello from Child
```


<a name="stringformat"></a>
### StringFormat
### ascii

**Description**: Returns a string with a printable ASCII representation of an object, escaping non-ASCII characters with backslash escapes.

**Example**:

```python
print(ascii('ñ'))
print(ascii({'pi': 'π'}))

# results:
# '\\xf1'
# {'pi': '\\u03c0'}
```

### bin

**Description**: Converts an integer to its binary string prefixed with `0b` (or `-0b` for negatives).

**Example**:

```python
print(bin(10))
print(bin(-10))

# results:
# 0b1010
# -0b1010
```

### chr

**Description**: Returns the character corresponding to a Unicode code point (inverse of `ord`).

**Example**:

```python
print(chr(97))
print(chr(8364))

# results:
# a
# €
```

### format

**Description**: Calls an object’s `__format__` method with a format spec. Useful for numbers, dates, and custom formatting.

**Example**:

```python
print(format(255, 'x'))   # hex
print(format(12.3456, '.2f'))

# results:
# ff
# 12.35
```

### hex

**Description**: Converts an integer to a lowercase hexadecimal string prefixed with `0x` (or `-0x`).

**Example**:

```python
print(hex(255))
print(hex(-16))

# results:
# 0xff
# -0x10
```

### oct

**Description**: Converts an integer to an octal string prefixed with `0o` (or `-0o`).

**Example**:

```python
print(oct(9))
print(oct(-9))

# results:
# 0o11
# -0o11
```

### ord

**Description**: Returns the Unicode code point for a single character string (inverse of `chr`).

**Example**:

```python
print(ord('A'))
print(ord('9'))

# results:
# 65
# 57
```

### repr

**Description**: Returns an unambiguous string representation of an object (ideally valid Python to recreate it). Used for debugging.

**Example**:

```python
print(repr('hello'))
print(repr([1, 2, 3]))

# results:
# 'hello'
# [1, 2, 3]
```

### str

**Description**: Converts an object to its string form (user-friendly). Without arguments, returns an empty string.

**Example**:

```python
print(str(123))
print(str({'a': 1}))

# results:
# 123
# {'a': 1}
```


<a name="compile-eval"></a><a id="compile-eval"></a>
### Compile/Eval
### compile

**Description**: Compiles source code into a code object that can be executed with `exec()` or evaluated with `eval()`.

**Example**:

```python
code = compile('x + 1', '<expr>', 'eval')
x = 41
print(eval(code))

# results:
# 42
```

### eval

**Description**: Evaluates a string as a Python expression and returns the result. Use carefully; avoid untrusted input.

**Example**:

```python
x = 1
print(eval('x + 2'))

# results:
# 3
```

### exec

**Description**: Executes dynamically built Python code. Supports multi-line code and definitions. Use carefully; avoid untrusted input.

**Example**:

```python
program = """
def greet(name):
    print(f'Hello, {name}!')

greet('World')
"""
exec(program)

# results:
# Hello, World!
```

### __import__

**Description**: Low-level import function used by `import` statements. Rarely needed directly; can be used for dynamic imports.

**Example**:

```python
math = __import__('math')
print(math.sqrt(9))

# results:
# 3.0
```

### breakpoint

**Description**: Drops into the debugger at the call site (uses `PYTHONBREAKPOINT` env var or `pdb.set_trace` by default). Helpful for interactive debugging.

**Example**:

```python
# breakpoint()
print("after breakpoint")

# results:
# [Would start debugger here]
# after breakpoint
```


<a name="async"></a>
### Async
### aiter

**Description**: Returns an asynchronous iterator for an async iterable (like an async generator). Used in `async for` loops.

**Example**:

```python
import asyncio

async def agen():
    for i in range(3):
        yield i

async def main():
    async for v in aiter(agen()):
        print(v)

# asyncio.run(main())

# results:
# 0
# 1
# 2
```

### anext

**Description**: Awaits and returns the next item from an asynchronous iterator. Accepts a default to return when exhausted.

**Example**:

```python
import asyncio

async def agen():
    for i in range(2):
        yield i

async def main():
    it = aiter(agen())
    print(await anext(it))
    print(await anext(it, 'done'))  # after last item

# asyncio.run(main())

# results:
# 0
# done
```


<a name="exceptions-warnings"></a><a id="exceptions-warnings"></a>
## Exceptions & Warnings

### BaseException

**Description**: The root of Python’s exception hierarchy. All exceptions inherit (directly or indirectly) from `BaseException`.

**Example**:

```python
try:
    raise BaseException("base problem")
except BaseException as e:
    print(type(e).__name__, str(e))

# results:
# BaseException base problem
```

### Exception

**Description**: Base class for most application-level errors. User-defined exceptions generally inherit from `Exception`, not `BaseException`.

**Example**:

```python
try:
    raise Exception("something went wrong")
except Exception as e:
    print(type(e).__name__, str(e))

# results:
# Exception something went wrong
```

### SystemExit

**Description**: Raised by `sys.exit()` to exit a program. Can be caught to run cleanup, but usually allowed to propagate.

**Example**:

```python
import sys
try:
    sys.exit(2)
except SystemExit as e:
    print("Exiting with code", e.code)

# results:
# Exiting with code 2
```

### KeyboardInterrupt

**Description**: Raised when the user interrupts program execution (usually Ctrl+C). Often used to stop long-running loops gracefully.

**Example**:

```python
try:
    # while True: pass  # Press Ctrl+C to interrupt
    raise KeyboardInterrupt
except KeyboardInterrupt:
    print("Program interrupted by user")

# results:
# Program interrupted by user
```

### GeneratorExit

**Description**: Sent to a generator to tell it to clean up and exit when `close()` is called or the generator is garbage-collected.

**Example**:

```python
def gen():
    try:
        yield 1
    finally:
        print("generator closing")

g = gen()
print(next(g))
g.close()

# results:
# 1
# generator closing
```

### StopIteration

**Description**: Raised by iterators to signal that no more items are available. `for` loops handle this automatically.

**Example**:

```python
it = iter([1, 2])
try:
    print(next(it))
    print(next(it))
    print(next(it))
except StopIteration:
    print("End of iterator")

# results:
# 1
# 2
# End of iterator
```

### StopAsyncIteration

**Description**: Raised by asynchronous iterators to signal completion. `async for` handles this automatically.

**Example**:

```python
import asyncio

async def agen():
    for i in range(2):
        yield i

async def main():
    it = agen().__aiter__()
    print(await it.__anext__())
    print(await it.__anext__())
    try:
        print(await it.__anext__())
    except StopAsyncIteration:
        print("done")

# asyncio.run(main())

# results:
# 0
# 1
# done
```

### ArithmeticError

**Description**: Base class for arithmetic-related errors like division by zero, overflow, or invalid floating operations.

**Example**:

```python
try:
    1 / 0
except ArithmeticError as e:
    print("Arithmetic error:", e)

# results:
# Arithmetic error: division by zero
```

### FloatingPointError

**Description**: Floating point operation failed at the C level (rare in pure Python). More commonly, overflow/underflow becomes `OverflowError` or silently rounds.

**Example**:

```python
try:
    raise FloatingPointError("floating point issue")
except FloatingPointError as e:
    print(type(e).__name__, e)

# results:
# FloatingPointError floating point issue
```

### OverflowError

**Description**: Raised when a result is too large to be represented (e.g., certain math functions on huge inputs).

**Example**:

```python
import math
try:
    math.exp(1000)
except OverflowError as e:
    print("Overflow:", e)

# results:
# Overflow: math range error
```

### ZeroDivisionError

**Description**: Raised when dividing or taking modulo by zero.

**Example**:

```python
try:
    10 / 0
except ZeroDivisionError as e:
    print("ZeroDivisionError:", e)

# results:
# ZeroDivisionError: division by zero
```

### AssertionError

**Description**: An `assert` statement failed because the condition evaluated to `False`.

**Example**:

```python
try:
    assert 2 + 2 == 5, "math is hard"
except AssertionError as e:
    print("AssertionError:", e)

# results:
# AssertionError: math is hard
```

### AttributeError

**Description**: Attribute reference or assignment failed (object does not have that attribute).

**Example**:

```python
class Thing: pass
t = Thing()
try:
    print(t.missing)
except AttributeError as e:
    print("AttributeError:", e)

# results:
# AttributeError: 'Thing' object has no attribute 'missing'
```

### BufferError

**Description**: Raised when a buffer-related operation cannot be performed (e.g., resizing a buffer that is exported).

**Example**:

```python
b = bytearray(b"abc")
mv = memoryview(b)
try:
    b.extend(b"d")  # cannot resize while a view exists
except BufferError as e:
    print("BufferError:", e)

# results:
# BufferError: Existing exports of data: object cannot be re-sized
```

### EOFError

**Description**: `input()` hit end-of-file (no more input) without reading any data.

**Example**:

```python
try:
    # data = input()  # send EOF (e.g., Ctrl+Z/Ctrl+D) to trigger
    raise EOFError
except EOFError:
    print("EOFError: No input received")

# results:
# EOFError: No input received
```

### ImportError

**Description**: Import system couldn’t find a name in a module or had another import-related problem.

**Example**:

```python
try:
    from math import not_a_name
except ImportError as e:
    print("ImportError:", e)

# results:
# ImportError: cannot import name 'not_a_name' from 'math' (unknown location)
```

### ModuleNotFoundError

**Description**: Subclass of `ImportError` raised when a module can’t be found.

**Example**:

```python
try:
    import clearly_not_a_module
except ModuleNotFoundError as e:
    print("ModuleNotFoundError:", e)

# results:
# ModuleNotFoundError: No module named 'clearly_not_a_module'
```

### LookupError

**Description**: Base class for index/key lookup errors like `IndexError` and `KeyError`.

**Example**:

```python
try:
    [][0]
except LookupError as e:
    print(type(e).__name__)
try:
    {}['x']
except LookupError as e:
    print(type(e).__name__)

# results:
# IndexError
# KeyError
```

### IndexError

**Description**: Subscript index is out of range for a sequence.

**Example**:

```python
lst = [1, 2, 3]
try:
    print(lst[5])
except IndexError as e:
    print("IndexError:", e)

# results:
# IndexError: list index out of range
```

### KeyError

**Description**: Requested key not found in a dictionary.

**Example**:

```python
d = {'a': 1}
try:
    print(d['b'])
except KeyError as e:
    print("KeyError:", repr(e))

# results:
# KeyError: 'b'
```

### MemoryError

**Description**: The operation ran out of memory. Often indicates a huge allocation.

**Example**:

```python
try:
    raise MemoryError("not enough memory")
except MemoryError as e:
    print(type(e).__name__, e)

# results:
# MemoryError not enough memory
```

### NameError

**Description**: A variable or function name is not defined in the current scope.

**Example**:

```python
try:
    print(does_not_exist)
except NameError as e:
    print("NameError:", e)

# results:
# NameError: name 'does_not_exist' is not defined
```

### UnboundLocalError

**Description**: Subclass of `NameError` for referencing a local variable before it’s assigned.

**Example**:

```python
def f():
    try:
        print(x)
        x = 2
    except UnboundLocalError as e:
        print("UnboundLocalError:", e)

f()

# results:
# UnboundLocalError: cannot access local variable 'x' where it is not associated with a value
```

### OSError

**Description**: Base class for system-related errors (files, OS calls). Many specific I/O exceptions inherit from it.

**Example**:

```python
import os
try:
    os.remove('no_such_file.txt')
except OSError as e:
    print("OSError:", e)

# results:
# OSError: [Errno 2] No such file or directory: 'no_such_file.txt'
```

### FileNotFoundError

**Description**: File or directory was requested but does not exist.

**Example**:

```python
try:
    open('missing.txt')
except FileNotFoundError as e:
    print("FileNotFoundError:", e)

# results:
# FileNotFoundError: [Errno 2] No such file or directory: 'missing.txt'
```

### PermissionError

**Description**: Operation lacked the required permissions (e.g., writing to a protected file or directory).

**Example**:

```python
try:
    raise PermissionError("not allowed")
except PermissionError as e:
    print(type(e).__name__, e)

# results:
# PermissionError not allowed
```

### ReferenceError

**Description**: Accessing a weak reference proxy after the referent has been garbage-collected.

**Example**:

```python
import weakref
class A: pass
a = A()
p = weakref.proxy(a)
del a
try:
    print(p)
except ReferenceError as e:
    print("ReferenceError:", e)

# results:
# ReferenceError: weakly-referenced object no longer exists
```

### RuntimeError

**Description**: Generic error that doesn’t fit other categories.

**Example**:

```python
try:
    raise RuntimeError("unexpected state")
except RuntimeError as e:
    print("RuntimeError:", e)

# results:
# RuntimeError: unexpected state
```

### NotImplementedError

**Description**: Indicates a method is intended to be overridden in a subclass but hasn’t been implemented yet.

**Example**:

```python
class Base:
    def run(self):
        raise NotImplementedError("subclass must implement run()")

try:
    Base().run()
except NotImplementedError as e:
    print("NotImplementedError:", e)

# results:
# NotImplementedError: subclass must implement run()
```

### RecursionError

**Description**: Maximum recursion depth exceeded, usually due to infinite or very deep recursion.

**Example**:

```python
def recurse():
    return recurse()

try:
    recurse()
except RecursionError as e:
    print("RecursionError:", e)

# results:
# RecursionError: maximum recursion depth exceeded
```

### SyntaxError

**Description**: The parser found invalid Python syntax.

**Example**:

```python
try:
    eval('x === x')
except SyntaxError as e:
    print("SyntaxError:", e.msg)

# results:
# SyntaxError: invalid syntax
```

### IndentationError

**Description**: Incorrect indentation of code blocks.

**Example**:

```python
code = 'def f():\nprint(1)\n'
try:
    compile(code, '<string>', 'exec')
except IndentationError as e:
    print("IndentationError:", e.msg)

# results:
# IndentationError: expected an indented block
```

### TabError

**Description**: Inconsistent use of tabs and spaces in indentation.

**Example**:

```python
code = 'def f():\n\tprint(1)\n    print(2)\n'
try:
    compile(code, '<string>', 'exec')
except TabError as e:
    print("TabError:", e.msg)

# results:
# TabError: inconsistent use of tabs and spaces in indentation
```

### SystemError

**Description**: Indicates an internal interpreter error occurred (rare). Usually reported along with a bug report message.

**Example**:

```python
try:
    raise SystemError("interpreter problem")
except SystemError as e:
    print(type(e).__name__, e)

# results:
# SystemError interpreter problem
```

### TypeError

**Description**: Operation or function applied to an object of inappropriate type.

**Example**:

```python
try:
    '2' + 2
except TypeError as e:
    print("TypeError:", e)

# results:
# TypeError: can only concatenate str (not "int") to str
```

### ValueError

**Description**: Argument has the correct type but an invalid value.

**Example**:

```python
try:
    int('abc')
except ValueError as e:
    print("ValueError:", e)

# results:
# ValueError: invalid literal for int() with base 10: 'abc'
```

### UnicodeError

**Description**: Base class for Unicode-related encoding/decoding/translation errors.

**Example**:

```python
try:
    '€'.encode('ascii')
except UnicodeError as e:
    print(type(e).__name__)  # specific subclass

# results:
# UnicodeEncodeError
```

### UnicodeEncodeError

**Description**: Error while encoding text to bytes (character not representable in the target encoding).

**Example**:

```python
try:
    '€'.encode('ascii')
except UnicodeEncodeError as e:
    print("UnicodeEncodeError:", e.reason)

# results:
# UnicodeEncodeError: ordinal not in range(128)
```

### UnicodeDecodeError

**Description**: Error while decoding bytes to text (byte sequence invalid for the target encoding).

**Example**:

```python
try:
    b'\xff'.decode('utf-8')
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", e.reason)

# results:
# UnicodeDecodeError: invalid start byte
```

### UnicodeTranslateError

**Description**: Error during translating Unicode (rare; occurs in some codecs or custom translators).

**Example**:

```python
try:
    raise UnicodeTranslateError('codec', 'text', 0, 1, 'translation failed')
except UnicodeTranslateError as e:
    print(type(e).__name__, e.reason)

# results:
# UnicodeTranslateError translation failed
```

### Warning

**Description**: Base class for all warning categories.

**Example**:

```python
import warnings
warnings.warn("This is a general warning", Warning)

# results:
# <stdin>:1: Warning: This is a general warning
```

### DeprecationWarning

**Description**: Feature is deprecated and may be removed in a future version (intended for developers).

**Example**:

```python
import warnings
warnings.warn("This feature is deprecated", DeprecationWarning)

# results:
# <stdin>:1: DeprecationWarning: This feature is deprecated
```

### PendingDeprecationWarning

**Description**: Feature is planned to be deprecated in the future (less commonly shown by default).

**Example**:

```python
import warnings
warnings.warn("This will be deprecated", PendingDeprecationWarning)

# results:
# <stdin>:1: PendingDeprecationWarning: This will be deprecated
```

### RuntimeWarning

**Description**: Warning for dubious runtime behavior (e.g., numerics, overflow to inf, etc.).

**Example**:

```python
import warnings
warnings.warn("Suspicious runtime behavior", RuntimeWarning)

# results:
# <stdin>:1: RuntimeWarning: Suspicious runtime behavior
```

### SyntaxWarning

**Description**: Warning about dubious Python syntax that is legal but potentially confusing.

**Example**:

```python
import warnings
warnings.warn("Questionable syntax", SyntaxWarning)

# results:
# <stdin>:1: SyntaxWarning: Questionable syntax
```

### UserWarning

**Description**: Default category for `warnings.warn()` when no specific category is provided.

**Example**:

```python
import warnings
warnings.warn("Something to note")

# results:
# <stdin>:1: UserWarning: Something to note
```

### FutureWarning

**Description**: Warns about behavior that will change in a future Python version.

**Example**:

```python
import warnings
warnings.warn("Behavior will change", FutureWarning)

# results:
# <stdin>:1: FutureWarning: Behavior will change
```

### ImportWarning

**Description**: Warnings related to the import system.

**Example**:

```python
import warnings
warnings.warn("Import system detail", ImportWarning)

# results:
# <stdin>:1: ImportWarning: Import system detail
```

### UnicodeWarning

**Description**: Warns about unicode-related issues that are not errors but may be surprising.

**Example**:

```python
import warnings
warnings.warn("Unicode oddity", UnicodeWarning)

# results:
# <stdin>:1: UnicodeWarning: Unicode oddity
```

### ResourceWarning

**Description**: Warns about resource usage (e.g., unclosed files) that may lead to problems.

**Example**:

```python
import warnings
warnings.warn("Resource may be unclosed", ResourceWarning)

# results:
# <stdin>:1: ResourceWarning: Resource may be unclosed
```

<a name="keywords"></a><a id="keywords"></a>
# 🐍 Python Keywords

### False

**Description**: Boolean false value. Used in conditions and logic to represent “no”/“off”.

**Example**:

```python
if False:
    print("won't run")
else:
    print("runs")

# results:
# runs
```

### None

**Description**: The “no value” object. Often used to mean “nothing”, “not set”, or “no result”.

**Example**:

```python
result = None
print(result is None)

# results:
# True
```

### True

**Description**: Boolean true value. Used in conditions and logic to represent “yes”/“on”.

**Example**:

```python
if True:
    print("always runs")

# results:
# always runs
```

### and

**Description**: Logical AND. Returns the first falsey operand or the last operand if all are truthy.

**Example**:

```python
print(True and 5)
print(0 and 5)

# results:
# 5
# 0
```

### as

**Description**: Gives an alias (alternate name), commonly in `import` and `with` statements.

**Example**:

```python
import math as m
print(m.sqrt(9))

# results:
# 3.0
```

### assert

**Description**: Checks a condition; raises `AssertionError` if false. Good for sanity checks during development.

**Example**:

```python
try:
    assert 2 + 2 == 5, "bad math"
except AssertionError as e:
    print(e)

# results:
# bad math
```

### async

**Description**: Marks a function as asynchronous (`async def`) so it returns a coroutine and can use `await`.

**Example**:

```python
async def fetch():
    return 42
print(fetch)  # calling needs an event loop

# results:
# <function ...>  # coroutine function object
```

### await

**Description**: Pauses inside an `async def` until the awaited coroutine/future completes and returns its result.

**Example**:

```python
# import asyncio
# async def main():
#     async def get(): return 3
#     x = await get()
#     print(x)
# asyncio.run(main())

# results:
# 3
```

### break

**Description**: Exits the nearest enclosing loop immediately.

**Example**:

```python
for i in range(5):
    print(i)
    break

# results:
# 0
```

### class

**Description**: Defines a class (a blueprint for objects with data and behavior).

**Example**:

```python
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return "Woof!"

d = Dog("Buddy")
print(d.name, d.bark())

# results:
# Buddy Woof!
```

### continue

**Description**: Skips the rest of the current loop iteration and continues with the next iteration.

**Example**:

```python
for i in range(3):
    if i == 1:
        continue
    print(i)

# results:
# 0
# 2
```

### def

**Description**: Defines a function (reusable block of code).

**Example**:

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))

# results:
# Hello, Alice!
```

### del

**Description**: Deletes a reference, item, or slice from a collection (or a variable name).

**Example**:

```python
d = {'a': 1, 'b': 2}
del d['a']
print(d)

# results:
# {'b': 2}
```

### elif

**Description**: “Else if” branch in a conditional chain after an `if`.

**Example**:

```python
x = 0
if x > 0:
    print('positive')
elif x == 0:
    print('zero')
else:
    print('negative')

# results:
# zero
```

### else

**Description**: The fallback branch for `if`/`elif`, or the branch after loops that didn’t `break`.

**Example**:

```python
for i in range(1):
    pass
else:
    print('loop finished without break')

# results:
# loop finished without break
```

### except

**Description**: Catches exceptions raised in the associated `try` block.

**Example**:

```python
try:
    1/0
except ZeroDivisionError:
    print('cannot divide by zero')

# results:
# cannot divide by zero
```

### finally

**Description**: A block that always runs after `try`/`except`, useful for cleanup.

**Example**:

```python
try:
    x = 1/0
except ZeroDivisionError:
    print('handled')
finally:
    print('cleanup')

# results:
# handled
# cleanup
```

### for

**Description**: Loops over items of an iterable (like lists, strings, ranges).

**Example**:

```python
for ch in 'hi':
    print(ch)

# results:
# h
# i
```

### from

**Description**: Imports specific names from a module.

**Example**:

```python
from math import sqrt
print(sqrt(16))

# results:
# 4.0
```

### global

**Description**: Declares that a variable inside a function refers to a module-level (global) variable.

**Example**:

```python
x = 1
def set_x():
    global x
    x = 99
set_x()
print(x)

# results:
# 99
```

### if

**Description**: Starts a conditional block executed when its condition is truthy.

**Example**:

```python
if 3 > 2:
    print('yes')

# results:
# yes
```

### import

**Description**: Imports a module so its contents can be accessed via the module name.

**Example**:

```python
import math
print(math.pi > 3)

# results:
# True
```

### in

**Description**: Tests membership in a container; also used in `for` loops.

**Example**:

```python
print(2 in [1, 2, 3])
print('a' in {'a': 1})

# results:
# True
# True
```

### is

**Description**: Tests object identity (whether two names refer to the same object), not equality of values.

**Example**:

```python
a = []
b = []
c = a
print(a == b, a is b, a is c)

# results:
# True False True
```

### lambda

**Description**: Creates a small anonymous function in a single expression.

**Example**:

```python
square = lambda x: x * x
print(square(5))

# results:
# 25
```

### match

**Description**: Starts a structural pattern matching block (Python 3.10+), matching a value against patterns.

**Example**:

```python
def kind(x):
    match x:
        case 0:
            return 'zero'
        case 1 | 2:
            return 'small'
        case _:
            return 'other'

print(kind(2))

# results:
# small
```

### case

**Description**: Used inside a `match` block to define each pattern branch.

**Example**:

```python
value = 3
match value:
    case 1:
        print('one')
    case 2:
        print('two')
    case _:
        print('other')

# results:
# other
```

### nonlocal

**Description**: Refers to a variable in the nearest enclosing (but not global) scope.

**Example**:

```python
def outer():
    x = 1
    def inner():
        nonlocal x
        x = 2
        return x
    inner()
    return x

print(outer())

# results:
# 2
```

### not

**Description**: Logical NOT. Returns `True` if the operand is falsey, otherwise `False`.

**Example**:

```python
print(not True, not 0, not [])

# results:
# False True True
```

### or

**Description**: Logical OR. Returns the first truthy operand or the last operand if all are falsey.

**Example**:

```python
print(0 or 'fallback')
print('x' or 'y')

# results:
# fallback
# x
```

### pass

**Description**: A no-op placeholder statement; it does nothing.

**Example**:

```python
def todo():
    pass
print('after pass')

# results:
# after pass
```

### raise

**Description**: Raises an exception to signal an error or unusual condition.

**Example**:

```python
try:
    raise ValueError('bad value')
except ValueError as e:
    print(e)

# results:
# bad value
```

### return

**Description**: Exits a function and sends a value back to the caller.

**Example**:

```python
def add(a, b):
    return a + b
print(add(3, 4))

# results:
# 7
```

### try

**Description**: Wraps code that might raise exceptions; pair with `except`, optionally `else` and `finally`.

**Example**:

```python
try:
    1/0
except ZeroDivisionError:
    print('oops')

# results:
# oops
```

### while

**Description**: Repeats a block while a condition is true.

**Example**:

```python
i = 0
while i < 2:
    print(i)
    i += 1

# results:
# 0
# 1
```

### with

**Description**: Enters a context manager that sets up and tears down resources automatically.

**Example**:

```python
with open('tmp.txt', 'w') as f:
    f.write('hi')
print('done')

# results:
# done
```

### yield

**Description**: Produces a value from a generator function and pauses its state until the next request.

**Example**:

```python
def gen():
    yield 1
    yield 2

print(list(gen()))

# results:
# [1, 2]
```

<a name="operators-delimiters"></a><a id="operators-delimiters"></a>
# 🐍 Python Operators & Delimiters

### `+`

**Description**: Addition for numbers; concatenation for sequences like `str` and `list`.

**Example**:

```python
print(5 + 3)
print('py' + 'thon')

# results:
# 8
# python
```

### `-`

**Description**: Subtraction for numbers; unary minus negates a number.

**Example**:

```python
print(5 - 3)
print(-(4))

# results:
# 2
# -4
```

### `*`

**Description**: Multiplication for numbers; sequence repetition for `str`, `list`, and `tuple`.

**Example**:

```python
print(5 * 3)
print('ha' * 3)

# results:
# 15
# hahaha
```

### `**`

**Description**: Exponentiation (power). Right-associative: `2 ** 3 ** 2` is `2 ** (3 ** 2)`.

**Example**:

```python
print(2 ** 3)
print(2 ** 3 ** 2)

# results:
# 8
# 512
```

### `/`

**Description**: True division. Always returns a float.

**Example**:

```python
print(5 / 2)

# results:
# 2.5
```

### `//`

**Description**: Floor division. Divides and rounds down to the nearest integer.

**Example**:

```python
print(5 // 2)
print(-5 // 2)

# results:
# 2
# -3
```

### `%`

**Description**: Modulo. Remainder after division; sign matches the divisor in Python.

**Example**:

```python
print(5 % 2)
print(-5 % 2)

# results:
# 1
# 1
```

### `@`

**Description**: Decorator marker in front of function/class definitions to modify behavior.

**Example**:

```python

def deco(fn):
    def wrapped():
        return 'wrapped ' + fn()
    return wrapped

@deco
def hello():
    return 'hello'

print(hello())

# results:
# wrapped hello
```

### `<<`

**Description**: Bitwise left shift. Shifts bits left, filling with zeros.

**Example**:

```python
print(5 << 1)

# results:
# 10
```

### `>>`

**Description**: Bitwise right shift. Shifts bits right; sign bit preserved for negatives.

**Example**:

```python
print(5 >> 1)

# results:
# 2
```

### `&`

**Description**: Bitwise AND. Sets a bit if it is set in both operands.

**Example**:

```python
print(5 & 3)

# results:
# 1
```

### `|`

**Description**: Bitwise OR. Sets a bit if it is set in either operand.

**Example**:

```python
print(5 | 3)

# results:
# 7
```

### `^`

**Description**: Bitwise XOR. Sets a bit if it differs between operands.

**Example**:

```python
print(5 ^ 3)

# results:
# 6
```

### `~`

**Description**: Bitwise NOT (invert). For integers, `~x` equals `-(x+1)`.

**Example**:

```python
print(~5)

# results:
# -6
```

### `:`

**Description**: Delimiter used in blocks (after `if`, `for`, `def`, etc.), dictionary pairs, and slicing.

**Example**:

```python
data = {'a': 1, 'b': 2}
print(data['a'])

# results:
# 1
```

### `=`

**Description**: Assignment. Binds a name to a value.

**Example**:

```python
x = 5
print(x)

# results:
# 5
```

### `==`

**Description**: Equality comparison. Checks whether two values are equal.

**Example**:

```python
print(5 == 5, 5 == 3)

# results:
# True False
```

### `!=`

**Description**: Inequality comparison. Checks whether two values are not equal.

**Example**:

```python
print(5 != 3, 5 != 5)

# results:
# True False
```

### `>`

**Description**: Greater-than comparison.

**Example**:

```python
print(5 > 3)

# results:
# True
```

### `<`

**Description**: Less-than comparison.

**Example**:

```python
print(5 < 3)

# results:
# False
```

### `>=`

**Description**: Greater-than-or-equal comparison.

**Example**:

```python
print(5 >= 5)

# results:
# True
```

### `<=`

**Description**: Less-than-or-equal comparison.

**Example**:

```python
print(5 <= 3)

# results:
# False
```

### `(`

**Description**: Parentheses. Group expressions and call functions.

**Example**:

```python
print((5 + 3) * 2)

# results:
# 16
```

### `)`

**Description**: Closing parenthesis. Ends grouping or function call list.

**Example**:

```python
print(len([1, 2, 3]))

# results:
# 3
```

### `[`

**Description**: Square bracket. List literals, indexing/slicing, and comprehensions.

**Example**:

```python
arr = [1, 2, 3]
print(arr[0:2])

# results:
# [1, 2]
```

### `]`

**Description**: Closing square bracket.

**Example**:

```python
print([x for x in range(3)])

# results:
# [0, 1, 2]
```

### `{`

**Description**: Brace. Dict and set literals; also used for f-string expressions.

**Example**:

```python
print({'a': 1, 'b': 2})
print({1, 2, 2})

# results:
# {'a': 1, 'b': 2}
# {1, 2}
```

### `}`

**Description**: Closing brace.

**Example**:

```python
d = {'x': 1}
print('x' in d)

# results:
# True
```

### `,`

**Description**: Comma. Separates items in lists, tuples, dicts, and function arguments.

**Example**:

```python
def greet(name, age):
    return f"{name}:{age}"
print(greet('Ada', 30))

# results:
# Ada:30
```

### `.`

**Description**: Dot. Attribute and method access.

**Example**:

```python
class A:
    def f(self):
        return 1
print(A().f())

# results:
# 1
```

### `;`

**Description**: Semicolon. Allows multiple simple statements on one line (discouraged for readability).

**Example**:

```python
x = 1; y = 2; print(x + y)

# results:
# 3
```

### `->`

**Description**: Function return type annotation arrow. Documents or type-checks return value types.

**Example**:

```python

print(... is Ellipsis)

# results:
# True
```

### `...`

**Description**: Ellipsis literal. Placeholder in code; used in advanced slicing and stubs.

**Example**:

```python

x = 5
x += 3
print(x)

lst = [1]
lst += [2]
print(lst)

# results:
# 8
# [1, 2]
```

### `+=`

**Description**: In-place add and assign. For mutable sequences, may modify in place.

**Example**:

```python

x = 5
x -= 3
print(x)

# results:
# 2
```

### `-=`

**Description**: In-place subtract and assign.

**Example**:

```python

x = 5
x *= 3
print(x)

# results:
# 15
```

### `/=`

**Description**: In-place true divide and assign.

**Example**:

```python

x = 5
x /= 2
print(x)

# results:
# 2.5
```

### `//=`

**Description**: In-place floor divide and assign.

**Example**:

```python

x = 5
x //= 2
print(x)

# results:
# 2
```

### `%=`

**Description**: In-place modulo and assign.

**Example**:

```python

x = 5
x %= 2
print(x)

# results:
# 1
```

### `@=`

**Description**: In-place matrix multiply and assign (for array libraries).

**Example**:

```python

# Example shown conceptually without external libs
acc = 0
for a, b in zip([1, 2], [3, 4]):
    acc += a*b
print(acc)

# results:
# 11
```

### `&=`

**Description**: In-place bitwise AND and assign.

**Example**:

```python

x = 7  # 0b111
x &= 3 # 0b011
print(x)

# results:
# 3
```

### `|=`

**Description**: In-place bitwise OR and assign.

**Example**:

```python

x = 1  # 0b001
x |= 4 # 0b100
print(x)

# results:
# 5
```

### `^=`

**Description**: In-place bitwise XOR and assign.

**Example**:

```python

x = 6  # 0b110
x ^= 3 # 0b011
print(x)

# results:
# 5
```

### `<<=`

**Description**: In-place left shift and assign.

**Example**:

```python

x = 3
x <<= 2
print(x)

# results:
# 12
```

### `>>=`

**Description**: In-place right shift and assign.

**Example**:

```python

x = 12
x >>= 2
print(x)

# results:
# 6
```

### `**=`

**Description**: In-place exponentiate and assign.

**Example**:

```python

x = 2
x **= 3
print(x)

# results:
# 8
```
