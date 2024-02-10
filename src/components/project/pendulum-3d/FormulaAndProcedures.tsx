import { MathJax } from "better-react-mathjax";

const FormulaAndProcedures = () => {
  const AtMaxHeight = () => {
    return (
      <div className=" w-5/6 mx-auto   ">
        <div className="bg-[#9fbec1] p-2 mx-4 my-2  rounded-md">
          At Maximum Height Position, {`$\\theta = \\alpha $`}
        </div>
        <div className="items-left text-left p-2 px-2 mx-2">
          Current Angle ( বর্তমান কোণ )[{`$\\text{degree}$`}],{" "}
          {`$$\\theta = \\alpha$$`}
          Height ( উচ্চতা )[{`$m$`}],
          {`$$h = h_{max} = l - lcos\\theta \\space  = l - lcos\\alpha \\space $$`}{" "}
          Acceleration ( ত্বরণ )[{`$ms^{-2}$`}],
          {`$$a \\space  = \\space a_{max} \\space = \\space  g\\sin\\theta \\space = g\\sin\\alpha$$`}
          Velocity( বেগ )[{`$ms^{-1}$`}],
          {`$$ v \\space = v_{min} = \\space 0 \\space$$`}
          Potential Energy ( বিভব শক্তি )[{`$J$`}],
          {`$$\\space  E_{p}\\space = \\space E_{p_{max}}\\space = \\space  mgh\\space = \\space mgh_{max} \\space $$`}
          Kinetic Energy ( গতিশক্তি )[{`$J$`}],
          {`$$E_k \\space = \\frac{1}{2}mv^2 \\space = \\space  \\frac{1}{2}m(0)^2 = 0\\space $$`}
          Total Energy ( মোট শক্তি )[{`$J$`}],
          {`$$
            \\begin{gather}
              E_{total} \\space = \\space E_p \\space + \\space E_k \\space = \\space mgh_{max}\\space  \\\\
               E_{total} \\space= mg \\space l ( 1 - cos\\alpha) \\space

          \\end{gather}
          
          $$`}
        </div>
      </div>
    );
  };

  const AtMinHeight = () => {
    return (
      <div className=" w-5/6 mx-auto">
        <div className="bg-[#9fbec1] p-2 mx-4 my-2  rounded-md">
          At Minimum Height Position, {`$\\theta = 0 $`}
        </div>
        <div className="items-left text-left p-2 px-2  mx-2">
          Current Angle ( বর্তমান কোণ )[{`$\\text{degree}$`}],{" "}
          {`$$\\theta = 0$$`}
          Height ( উচ্চতা )[{`$m$`}],
          {`$$h = h_{min} = l - lcos(0) \\space = \\space 0 $$`}
          Acceleration ( ত্বরণ )[{`$ms^{-2}$`}],
          {`$$a \\space  = \\space a_{min} \\space = \\space  g\\sin\\theta \\space = g\\sin(0) = 0$$`}
          Velocity( বেগ )[{`$ms^{-1}$`}],
          {`$$ 
          \\begin{gather}
            E_k = E_{total} - E_p \\\\
            E_k = mgh_{max} - 0 \\\\
            \\frac{1}{2}mv^2 =  mg \\space l ( 1 - cos\\alpha) \\\\
            v^2 = 2g \\space l ( 1 - cos\\alpha)  \\\\
            v = \\sqrt{2g \\space l ( 1 - cos\\alpha) }\\\\
          \\end{gather}
          
          $$`}
          Potential Energy ( বিভব শক্তি )[{`$J$`}],
          {`$$\\space  E_{p}\\space = \\space E_{p_{min}}\\space = \\space  mgh\\space = \\space mg(0) \\space = 0$$`}
          Kinetic Energy ( গতিশক্তি )[{`$J$`}],
          {`$$
           \\begin{gather}
              E_k =\\space \\frac{1}{2} m \\space v^2 \\\\
              =\\space \\frac{1}{2}m \\space(2g\\space l(1  -  cos\\alpha)) \\\\
              = \\space mg\\space l \\space (1 - cos\\alpha)
          \\end{gather}
          $$`}
          Total Energy ( মোট শক্তি )[{`$J$`}],
          {`$$
          \\begin{gather}
            E_{total} \\space = \\space E_p \\space + \\space E_k \\space = \\space 0 + E_{k_{max}} \\\\
            \\space = \\space mg \\space l ( 1 - cos\\alpha) \\space
          
          \\end{gather} 
          $$`}
        </div>
      </div>
    );
  };

  const AtInBetween = () => {
    return (
      <div className=" w-5/6 mx-auto">
        <div className="bg-[#9fbec1] p-2 mx-4 my-2  rounded-md">
          At Any Position, {`$\\theta $`}
        </div>
        <div className="items-left text-left p-2 px-2 mx-2">
          Current Angle ( বর্তমান কোণ )[{`$\\text{degree}$`}],{" "}
          {`$$\\theta =\\theta$$`}
          Height ( উচ্চতা )[{`$m$`}] ,
          {`$$h  = l\\space  - l\\space cos\\theta  $$`}
          Acceleration ( ত্বরণ )[{`$ms^{-2}$`}],
          {`$$a \\space = \\space  g   \\sin\\theta $$`}
          Velocity( বেগ )[{`$ms^{-1}$`}],
          {`$$ 
          \\begin{gather}
            v^2 = 2 g h_{down} \\space\\\\
             = 2g(l \\space cos\\theta - l \\space cos\\alpha)\\\\
            v = \\sqrt{2g(l \\space cos\\theta - l \\space cos\\alpha)}\\\\
          \\end{gather}
          
          $$`}
          Potential Energy ( বিভব শক্তি )[{`$J$`}],
          {`$$\\space  E_{p}\\space  = \\space  mgh\\space = \\space mg\\space (l \\space - l\\space cos\\theta)$$`}
          Kinetic Energy ( গতিশক্তি )[{`$J$`}],
          {`$$
          \\begin{gather}
            E_k =\\space \\frac{1}{2} m \\space v^2 \\\\
            =\\space \\frac{1}{2}m \\space(2g(l \\space cos\\theta - l \\space cos\\alpha)) \\\\
            = \\space mg\\space l \\space (cos\\theta - cos\\alpha)
          \\end{gather}
          $$`}
          Total Energy ( মোট শক্তি )[{`$J$`}],
          {`$$E_{total} \\space = \\space E_p \\space + \\space E_k \\space  = mg \\space l ( 1 - cos\\alpha) $$`}
        </div>
      </div>
    );
  };

  return (
    <MathJax>
      <p className="text-center text-3xl pt-3">Formula & Procedures</p>
      <hr className="my-2 w-5/6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-wrap gap-3 font-bold ">
        <AtMaxHeight />
        <AtMinHeight />
        <AtInBetween />
      </div>
    </MathJax>
  );
};

export default FormulaAndProcedures;
