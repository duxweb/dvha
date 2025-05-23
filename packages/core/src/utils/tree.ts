interface TreeNode {
  [key: string]: any
}

interface TreeOptions {
  idKey: string
  parentKey: string
  sortKey: string
  childrenKey: string
}

export function arrayToTree(data: Record<string, any>[], options: TreeOptions, key?: any): TreeNode[] {
  let itemArr: TreeNode[] = []
  data.forEach((item) => {
    if (item[options.parentKey] === key) {
      const children = arrayToTree(data, options, item[options.idKey])

      if (children.length > 0) {
        item[options.childrenKey] = children
      }
      itemArr.push(item)
    }
  })
  itemArr = itemArr.sort((a, b) => {
    return a[options.sortKey] - b[options.sortKey]
  })
  return itemArr
}

export function searchTree(tree: TreeNode[], func: (item: TreeNode) => boolean, findArr: TreeNode[] = []) {
  if (!tree || !tree.length) {
    return []
  }
  for (const data of tree) {
    findArr.push(data)
    if (func(data)) {
      return findArr
    }
    if (data?.children && data?.children?.length) {
      const findChildren = searchTree(data.children, func, findArr)
      if (findChildren.length)
        return findChildren
    }
    findArr.pop()
  }
  return []
}

export function treeToArr<T>(tree: TreeNode[], idKey: string | number, childrenKey: string): T[] {
  let arr: any[] = []
  if (!tree || !tree.length) {
    return arr
  }
  for (const data of tree) {
    arr.push(data[idKey])
    if (data[childrenKey] && data[childrenKey].length) {
      const findChildren = treeToArr(data[childrenKey], idKey, childrenKey)
      if (findChildren.length)
        arr = arr.concat(findChildren)
    }
  }
  return arr
}
