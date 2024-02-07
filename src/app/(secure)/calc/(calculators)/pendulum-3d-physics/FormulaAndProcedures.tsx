import { MathJax } from "better-react-mathjax";

const FormulaAndProcedures = () => {
  const AtMaxHeight = () => {
    return (
      <div className=" w-5/6 mx-auto">
        <div className="bg-[#9fbec1] p-2 mx-4 my-2  rounded-md">
          At Maximum Height Position,{" "}
          {`$
          \\theta = \\alpha $`}{" "}
        </div>
        <div className="items-left text-left p-2 px-10 mx-2">
          Current Angle ( বর্তমান কোণ )[{`$\\text{degree}$`}],{" "}
          {`$$\\theta = \\alpha$$`}
          Acceleration ( ত্বরণ )[{`$ms^{-2}$`}],
          {`$$a \\space  = \\space a_{max} \\space = \\space  g\\sin\\theta \\space = g\\sin\\alpha$$`}
          Velocity( বেগ )[{`$ms^{-1}$`}],
          {`$$ v \\space = v_{min} = \\space 0 \\space$$`}
          Height ( উচ্চতা )[{`$m$`}],
          {`$$h = h_{max} = l - lcos\\theta \\space $$`} Potential Energy ( বিভব
          শক্তি )[{`$J$`}],
          {`$$\\space  E_{p}\\space = \\space E_{p_{max}}\\space = \\space  mgh\\space = \\space mgh_{max} \\space $$`}
          Kinetic Energy ( গতিশক্তি )[{`$J$`}],
          {`$$E_k \\space = \\frac{1}{2}mv^2 \\space = \\space  \\frac{1}{2}m(0)^2 = 0\\space $$`}
          Total Energy ( মোট শক্তি )[{`$J$`}],
          {`$$E_{total} \\space = \\space E_p \\space + \\space E_k \\space = \\space mgh_{max}\\space $$`}
        </div>
      </div>
    );
  };

  const AtMinHeight = () => {
    return (
      <div className=" w-5/6 mx-auto">
        <div className="bg-[#9fbec1] p-2 mx-4 my-2  rounded-md">
          At Minimum Height Position,{" "}
          {`$
          \\theta = 0 $`}{" "}
        </div>
        <div className="items-left text-left p-2 px-10 mx-2">
          Current Angle ( বর্তমান কোণ )[{`$\\text{degree}$`}],{" "}
          {`$$\\theta = 0$$`}
          Acceleration ( ত্বরণ )[{`$ms^{-2}$`}],
          {`$$a \\space  = \\space a_{min} \\space = \\space  g\\sin\\theta \\space = g\\sin(0) = 0$$`}
          Velocity( বেগ )[{`$ms^{-1}$`}],
          {`$$ \\begin{}  \\space$$`}
          Height ( উচ্চতা )[{`$m$`}],
          {`$$h = h_{min} = l - lcos(0) \\space = \\space 0 $$`}
          Potential Energy ( বিভব শক্তি )[{`$J$`}],
          {`$$\\space  E_{p}\\space = \\space E_{p_{min}}\\space = \\space  mgh\\space = \\space mg(0) \\space = 0$$`}
          Kinetic Energy ( গতিশক্তি )[{`$J$`}],
          {`$$E_k \\space =  E_{k_{max}} = \\space  E_{total} - E_p   = \\space E_{total}- 0 = E_{total }  $$`}
          Total Energy ( মোট শক্তি )[{`$J$`}],
          {`$$E_{total} \\space = \\space E_p \\space + \\space E_k \\space = \\space 0 + E_{k_{max}} = \\space E_{k_{max}} $$`}
        </div>
      </div>
    );
  };

  const AtInBetween = () => {
    return <div>InBetween</div>;
  };

  return (
    <MathJax>
      <p className="text-2xl  text-center">Formula and Procedures</p>
      <div className="grid grid-cols-1 md:grid-cols-2 flex-wrap gap-3">
        <AtMaxHeight />
        <AtMinHeight />
      </div>
      <AtInBetween />
    </MathJax>
  );
};

export default FormulaAndProcedures;
