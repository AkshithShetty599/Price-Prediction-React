# Mapping dictionaries
laundry_map = {
    '(a) in-unit': 'in-unit',
    '(b) on-site': 'not in-unit',
    '(c) no laundry': 'not in-unit'
}
pet_map = {
    '(a) both': 'allows_dogs',
    '(b) dogs': 'allows_dogs',
    '(c) cats': 'no_dogs',
    '(d) no pets': 'no_dogs'
}
house_map = {
    '(a) single': 'single',
    '(b) double': 'multi',
    '(c) multi': 'multi'
}
district_map = {
    1.0: "west",
    2.0: "southwest",
    3.0: "southwest",
    4.0: "central",
    5.0: "central",
    6.0: "central",
    7.0: "marina",
    8.0: "north beach",
    9.0: "FiDi/SOMA",
    10.0: "southwest"
}