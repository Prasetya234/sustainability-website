import React from "react";
const TableAccess = ({
  menuAcces,
  modul,
  handleCheckbox,
  arrView,
  arrCreate,
  arrUpdate,
  arrDelete,
  arrPrint,
  index,
  findIndx,
}) => {
  return (
    <>
      <tr key={modul.MENU_ID} className="table-warning">
        <th>{index + 1}</th>
        <th colSpan={4}>{modul.MENU_MODUL}</th>
        <td className="text-center">
          <input
            className="form-check-input"
            type="checkbox"
            disabled={modul.MENU_ACT_VIW !== 1 ? true : ""}
            defaultChecked={arrView[findIndx(menuAcces, modul.MENU_ID)]}
            name="view"
            id={`view${modul.MENU_ID}${findIndx(menuAcces, modul.MENU_ID)}`}
            onChange={(e) =>
              handleCheckbox(e, findIndx(menuAcces, modul.MENU_ID))
            }
          ></input>
        </td>
        <td colSpan={4}></td>
      </tr>
      {menuAcces
        .filter(
          (men) =>
            men.MENU_CONTROL_ID === modul.MENU_CONTROL_ID &&
            men.MENU_KEY !== null &&
            men.MENU_KEY === "1"
        )
        .map((menu, index) => (
          <React.Fragment key={index}>
            <tr key={menu.MENU_ID} className="table-success">
              <th colSpan={2} className="text-end">
                {index + 1}
              </th>
              <th colSpan={3}>GROUP {menu.MENU_GROUP}</th>
              <td className="text-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={menu.MENU_ACT_VIW !== 1 ? true : ""}
                  defaultChecked={arrView[findIndx(menuAcces, menu.MENU_ID)]}
                  name="view"
                  id={`view${menu.MENU_ID}${findIndx(menuAcces, menu.MENU_ID)}`}
                  onChange={(e) =>
                    handleCheckbox(e, findIndx(menuAcces, menu.MENU_ID))
                  }
                ></input>
              </td>
              <td colSpan={4}></td>
            </tr>
            {menuAcces
              .filter(
                (sub) =>
                  sub.MENU_CONTROL_ID === modul.MENU_CONTROL_ID &&
                  sub.MENU_GROUP === menu.MENU_GROUP &&
                  sub.MENU_KEY !== "1"
              )
              .map((menu, index) => (
                <tr key={menu.MENU_ID}>
                  {/* <td></td>
                  <td></td> */}
                  {menu.MENU_KEY !== "3" ? (
                    <>
                      <td colSpan={3} className="text-end">
                        {index + 1}
                      </td>
                      <td colSpan={2}>{menu.MENU_GROUP_SUB}</td>
                    </>
                  ) : (
                    <>
                      <td></td>
                      {/* <td></td>
                      <td></td> */}
                      <td colSpan={3}></td>
                      <td>{menu.MENU_TITLE}</td>
                    </>
                  )}
                  <td className="text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      disabled={menu.MENU_ACT_VIW !== 1 ? true : ""}
                      defaultChecked={
                        arrView[findIndx(menuAcces, menu.MENU_ID)]
                      }
                      name="view"
                      id={`view${menu.MENU_ID}${findIndx(
                        menuAcces,
                        menu.MENU_ID
                      )}`}
                      onChange={(e) =>
                        handleCheckbox(e, findIndx(menuAcces, menu.MENU_ID))
                      }
                    ></input>
                  </td>
                  <td className="text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked={
                        arrCreate[findIndx(menuAcces, menu.MENU_ID)]
                      }
                      disabled={menu.MENU_ACT_ADD !== 1 ? true : ""}
                      name="create"
                      id={`add${menu.MENU_ID}${findIndx(
                        menuAcces,
                        menu.MENU_ID
                      )}`}
                      onChange={(e) =>
                        handleCheckbox(e, findIndx(menuAcces, menu.MENU_ID))
                      }
                    ></input>
                  </td>
                  <td className="text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked={
                        arrUpdate[findIndx(menuAcces, menu.MENU_ID)]
                      }
                      disabled={menu.MENU_ACT_MOD !== 1 ? true : ""}
                      name="update"
                      id={`mod${menu.MENU_ID}${findIndx(
                        menuAcces,
                        menu.MENU_ID
                      )}`}
                      onChange={(e) =>
                        handleCheckbox(e, findIndx(menuAcces, menu.MENU_ID))
                      }
                    ></input>
                  </td>
                  <td className="text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked={
                        arrDelete[findIndx(menuAcces, menu.MENU_ID)]
                      }
                      disabled={menu.MENU_ACT_DEL !== 1 ? true : ""}
                      name="delete"
                      id={`del${menu.MENU_ID}${findIndx(
                        menuAcces,
                        menu.MENU_ID
                      )}`}
                      onChange={(e) =>
                        handleCheckbox(e, findIndx(menuAcces, menu.MENU_ID))
                      }
                    ></input>
                  </td>
                  <td className="text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked={
                        arrPrint[
                          menuAcces.findIndex(
                            (mod) => mod.MENU_ID === menu.MENU_ID
                          )
                        ]
                      }
                      disabled={menu.MENU_ACT_PRN !== 1 ? true : ""}
                      name="print"
                      id={`prin${menu.MENU_ID}${index}`}
                      onChange={(e) =>
                        handleCheckbox(e, findIndx(menuAcces, menu.MENU_ID))
                      }
                    ></input>
                  </td>
                </tr>
              ))}
          </React.Fragment>
        ))}
    </>
  );
};

export default TableAccess;
