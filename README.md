# cart_calculator_comparer
This Vanilla JS script is designed for the rapid creation of shopping carts and product/item calculators, as well as comparing selected items across multiple carts or boxes.

# Documentation

## 1. Purpose

`calculator.js` builds a two-panel calculator interface. A user can search for catalog items, add items to either panel, remove items, and view totals.

The code is designed for comparing different items and for use in product catalogs and shopping cart flows. It can process multiple object types, including objects that represent a single item value or a total monetary amount, and it supports conversion of monetary values into different currencies. The resulting data can also be sent to an external API for further processing or integration with other systems.

The code returns HTML from `Calculator(options)`. The page places this HTML in an element with the id `calculator`.

## 2. Files

- `calculator.js`: Calculator logic and HTML generation.
- `test-data.js`: Example catalog data. It defines `CALCULATORDATA`.
- `calculator-demo.html`: Demo page. It loads the data, calculator logic, and CSS.
- `calculator-demo.css`: Demo and calculator styles.

## 3. Input Data

Call the calculator with an options object:

```js
Calculator({
  boxAmount: 4,
  CALCULTATORDATA: catalogItems
});
```

`CALCULTATORDATA` must be an array. Each item can contain these properties:

| Property | Type | Use |
| --- | --- | --- |
| `name` | string | Item name. |
| `pic` | string | Image URL or image path. |
| `csign` | string | Currency or unit sign. |
| `price` | number | Item total count or quantity value. |
| `value` | number | Item price value. |

The code accepts different object types and can work with values that represent either an individual value or a total money sum. This makes it suitable for comparing products, pricing totals, and catalog data across multiple categories. Money values can be converted into different currencies, and the processed data can be transmitted to an external API for remote handling or storage.

The code uses an empty array when the data value is missing or is not an array.

## 4. Settings

| Setting | Default | Description |
| --- | --- | --- |
| `boxAmount` | `10` | Legacy option. |
| `boxAmountMin` | `4` | Minimum number of panel cells. |
| `boxMainId` | `calcMainBox` | Main calculator element id. |
| `boxId1` | `calcBox1` | First panel element id. |
| `boxId2` | `calcBox2` | Second panel element id. |

A non-positive or invalid `boxAmountMin` value becomes `4`.

## 5. State Model

The calculator has two panel states: `box1` and `box2`.

Each panel stores:

- `content`: Items selected by the user.
- `contentTemp`: Items shown by the current search.
- `inputSearch`: Current search text.
- `values.total`: Sum of item `price` values.
- `values.totalValue`: Sum of item `value` values.
- `amount`: Number of cells rendered in the panel.

## 6. User Actions

The interface uses delegated document events.

- `toggle-search`: Opens or closes the search panel.
- `search`: Filters catalog items by name.
- `add-item`: Adds a selected catalog item.
- `remove-item`: Removes an item from a panel.

The event data uses `data-action`, `data-box`, and `data-index` attributes.

## 7. Rendering Rules

`compileTemplate()` creates the complete calculator.

`boxTemplate()` creates one panel and its totals.

`compileContent()` creates selected items and empty cells.

`compileContentAll()` creates search results.

All catalog values inserted into HTML pass through `escapeHtml`. This prevents catalog text from being interpreted as HTML.

## 8. Number Formatting

`numberFormat(number, decimals, decimalPoint, thousandsSeparator)`:

1. Converts the input to a number.
2. Uses zero for a non-finite value.
3. Rounds to the requested decimal count.
4. Adds thousands separators.
5. Adds the requested decimal separator.

## 9. Browser Requirements

The page requires a browser with support for:

- `const` and `let`.
- Template literals.
- `Element.closest()`.
- `Element.dataset`.
- `Number.isFinite()`.

## 10. Local Test

Open `calculator-demo.html` in a browser. The page must show two calculator panels and the sample catalog must be searchable.

For syntax validation, run:

```text
node --check calculator.js
```

Expected result: no output and exit code `0`.

