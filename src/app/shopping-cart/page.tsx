"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { getDBUserID } from "@/actions/user.action";
import { set } from "mongoose";
import { ShoppingCardSkeleton } from "@/components/ShoppingCardSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getQPayInvoice, checkPayment } from "@/actions/payment.action";
import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

interface invoiceId {
  invoice_id: string;
}
const CartPage = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartStore();
  const [userId, setUserId] = useState<string | null>("");

  const [paymentMethod, showPaymentMethod] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [qpayImage, setQpayImage] = useState("")
  // const [qpayImage, setQpayImage] = useState(
  //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAABmJLR0QA/wD/AP+gvaeTAAAdS0lEQVR4nO3daZRU1bUH8H9VNyjzjAhh1qCCBkPECGikQXEAzCOgPF+WmhcGwYhg4gMTnyt5QjQmxIBKRDSgmVAxIeE9UQHFdoiCrSiDBAG7gWZSUIamgZ7eB1aQrq66t07tfc6t0/3/reUHu+4993TV7c25p/bZJ1ZVVVUFIiIPxKPuABFRuhiwiMgbDFhE5A0GLCLyBgMWEXmDAYuIvMGARUTeYMAiIm8wYBGRNxiwiMgbDFhE5A0GLCLyBgMWEXmDAYuIvMGARUTeyJU2EIvFNPqRlmwq3RX2e5v2VfI+Jl5L2jfT8xOPt/k5Sa916vkuP6NkTr2+6e8l7YvpPaNJcn9whEVE3mDAIiJvMGARkTfEc1iJNOcvpM/V2nMrQf3Rng8xac/0fdKcB3JNOvcimTcy7Yukr5LfS0M2/R2fiiMsIvIGAxYReYMBi4i8oT6Hlcjms7h2LpSmKOffTHN4tOe0JLlOpmzmhIV9hqbXMpnTMp3/spkLF/V82qk4wiIibzBgEZE3GLCIyBvW57CyiWY+iHTuRPN4af5QGMlcjev3xaQ912swbdJ+X7MVR1hE5A0GLCLyBgMWEXnD6zks1zk+JsdKa0qFMcl10lzjls7xQa+7nksJ+l1N86YSaeYnSXPjasscVRiOsIjIGwxYROQNBiwi8ob1OSyXz9Jhz/E26xclcl2T22ZbNmt32a5JJSGdowr7XW32JZHkfsmm+TCOsIjIGwxYROQN9UdCl8sTTB/ppENbkyUn2qVHTL6el/ZN+qgsSR1w/ZkGcfm+uvxMkp0fdny24AiLiLzBgEVE3mDAIiJviOewovzKU3PLJ9sky1m027ad3mFzizKXbM9DSkT5mUWJIywi8gYDFhF5gwGLiLwRq3L88GqyzEN7Gy+b24JpL50wmf+wPQ9kc/mL7dvP5fIqyfHSckTa5Z6DRLm9HkdYROQNBiwi8gYDFhF5Q5yHJX2eDXo96jkqydovk7YyeV1y7bDzNedTtOdaXM6faM8Napbctp3zZXK/aa9jDMIRFhF5gwGLiLzBgEVE3lBfS2haFtZmjSCTa0nZntNKZJLDE3RuJn3RrKUkLYlsSnMe0vR1zXw22/WtsnVtIUdYROQNBiwi8gYDFhF5w/k2X1HWA7e5Ji6RzXryYa/ZzouR1Js3ZfMzsvmZJCPJbbI9P6u5VtXmXDFHWETkDQYsIvIGAxYReUN9Dktzq3HTvBbb6/kk13KZAxbG9no+E7bX6wV9DtI50ESSzzjqNZeaa1VtrnPkCIuIvMGARUTeYMAiIm+o18OS1L8yPdZ1vSJJjlhQW+mQrM8zXd8pzesyOdb1ZxxEu/6apH3tvKoo1zlq4giLiLzBgEVE3mDAIiJvZN2+hCa084NszjFoz92YrP1yuYYy8Xq2f2/NHKBsrr8mrWWvmSMWdm2uJSQiAgMWEXmEAYuIvOF8X0LN53jXe7UFkdbikuQA2Z4/c/m+muaQuZyfi/L+kvbFp/WgQTjCIiJvMGARkTesl0i2WeZCOhSVfFUsfazSLP+s/ZW3VFB7US850To2Gc3lVtpbjkmmKLJpORVHWETkDQYsIvIGAxYReUN9q/owmmVSbH+N7HJpRSKb8wQu56wS2Z6bkZSmdrm0y/R46fytyy3tbOIIi4i8wYBFRN5gwCIib4jLy2RzCdswkiUo2ltrSV+XtCWl2ReXZXtclxEOOl/7fdBkM/fNFEdYROQNBiwi8gYDFhF5Q71Esuazt3YZFNP2XV7bZUlkl/NKLufLkjGZN5JeW/KZZnPJbdO2wnCreiKqExiwiMgbDFhE5A3nW9WbzJdoPytrr1PTJNleXntr+ShzgLRL/Zr0Tbu+ms33TTrPaPPeZh4WEREYsIjIIwxYROQN9Zru0jo9NnOjNPNutOsTSeZqol53JnkvXN8vmvXYpEzWpmqvB3W5HlCz7xxhEZE3GLCIyBsMWETkDev7Ekpo10E3ZTOfJMp1j6Z9iXLr+kQu9yW0ff/ZrMuv+Zm7zEcMwxEWEXmDAYuIvMGARUTecL4voc22Xc45SHO8wris1WUzx0d7zslmzlmUte/D2M6tc7mmV4IjLCLyBgMWEXmDAYuIvKFe0924AxZrAoUdH0ayL2GU+8iFsb0HnqQ+uMv9G6U087ai/D20sR4WEREYsIjII5GXl9HchklSZtj0etqPfJJHAO30D5tbtmuX8pXeI0Ftm/bF5FrpnG/C5WN8WNs200M4wiIibzBgkdiyZcuwdu1a7Nu3D8ePHw88dsKECbjooosQj/PWI3NZXa2BsscZZ5yBESNGYOjQoTVeGzx4cNrtzJkzBwBQUlKC/Px8tf5R3SBOa3C9FZekrSi3NrK9FbmJdN+XeDyOYcOGYfHixWrXNuXyfbOdFhPUnvRezeZ0Ds5hkVW5ubm49dZbsWXLlkiDFVEiPhJSDZs2bULXrl2j7gZRDRxhUQ3ZFKyWL1+O7t27R90NyhLqc1iayz40t71PRrO8jLRvkvct6hLGBw4exudfHMS+fftRVl6Bz/YfRGVlBRo2OB0tmzVGvfr10aZ1C7Rp0wo5wm8Ho9xS3eVnGnbtRLa3/Qq6lsv7j4+EZOyLA4ewfsPHeO+DjXjh1TV48aM96Z1YBfzo2xfikot64oJeX0XXLh2NA1iDBg1QWlqaQa+pNuAIy0BdHmGVlZdjzQcf4e9LX8f0Z98xPj+ZK77aGmNuvAKXX3oR2rZpldY5q1evxvDhw7F7927x9TnCSr/9oGu5HGExYBmoiwGrrKwMr79VgF/OeR4vfrQ37fOMVAEzxw/CDSOGoEP7M0IP37p1K/Ly8lBUVCS7LANW2u0HXatWBSxpeyai/NBsC+qbaV+2b9+Ojh07hh73/gcf4b6Zv8df1xQbtZ+xyio8+V/fxqgRV6FJ44aBhxYXF6N///4oLCwMPM7lH6JEtpXVsbnmkgErgmv7HLDCHDp8BI/Pfw4/mveKarvpuqxLC8yaPh69Lzg38LitW7eiW7dugccwYOn0x6RtBqw0MWDJFRbtwG1TZ+OFDWlOpFu0YNp3cOP116BebubfDTFg6fTHpG0GrDQxYMmsLliLYRNnYU9pmUp7Gu65vi+mTvkeGjcKfkRMhQFLpz8mbWd1wAq9gMN1RrbzjSTXyqZ1jcm89sZqXD7xEbU+aBqX1wO/mn4HmjRulPqYceMwb948o3ZdfkljynbfwgR9wWT6e6n+jTNgublWNgest95+D/3HzgLsrZcVG5fXAzNnTE450iopKUHv3r2xefPmtNtkwEotWwMWl+bUcWvXb0L/cdkdrADg8Vf+iV88NB9l5eVJX2/UqBHmzp3ruFfkGgNWHbZ772e46Y6Hou5G2qY/uwp/fu6FlK/n5eVh9OjRDntErqk/EqpOsAkfu8JoJmuGtR1GMpGZ7LXc3NzAqgtl5eWYMm0mHn15g1E/s8H7f7gbvS84R9yO9qONzSTpMNL7MajvUU6yJ+IIq5YaM2ZMYNWFF17K9zJYAcDkex/DocNHou4GRYABqxaKx+OYOnVqytf3froPN9zze7udsPiFx2tbP8dzf33JWvuUvVitoRYaNmwYunTpkvL1BX9cgmMVlWrXG/n1r2DU8Etxbo9uaN2qBVo0b4p4PI6SI0dx4OBBFBYV4+3V63Df7/NxpEInkH3/wcUYMrgfOpwZvvaQag/nW9XbTOQzvZbkfO35DE0vvvgirrrqqqSvbS/ehU5XT1O5zqSrz8fYm6/DeeechXg8/HM9cPAQXl7xJqY8+DyKS4J310nHzHGDcOcPbgo8RjI3E0bz/tOef9U+PojTdCIGrMzOz+aAVVVVlbLvDz/2J0yaI3uc6ty4PuY/MAbfGtA3rUCV6NPP9uMXDz2FmUvWiPqBKmDPKw+hbZuWKQ9hwNI5PojLe51zWLVQqpvx4KHDuGfeMlHbAzo3R/4zP8PAyy7OKFgBQJvWLXH/T2/HY5NrbhlmJHYiQ5/qDgasOqTgvXU4WJb53FW/jk2xcO6P0alje3Ff6tXLxdjvjcRv77hW1M4Tf1qGikq9+TjKbuKAFYvFAv9LVFVVVe0/k7a1r216vklfw35PybVStZWTk4OSkpKUxy1/7d3ML1JZhcdn3pFWgb10xWMxfP+mEbhz2NcybuPlf36KwsIdKV8P+szDjg37L5HkHgjri5Tp/Sb5u9C8txNxhFWL9OnTB40aJV8gfORIKR54PvPHpwV3j0DPc87K+PxU6tXLxdTJt6Dt6Zl/Yf3h+k2KPaJsxoBVi/Tp0yfla0XbdqIyw3+o+7RrjO9cd2WGvQrXtk1LPDxtVMbnv1PgZwIsmWPAqkV69eqV8rUtn2zPuN0fjr0GjUNKFktdOagfTstwEv/Bv61xXp+MoqGeOCq9cVx+naq5Bkr7a2bJtZPZWpR5Xfb+l3w943PT1bxZU/z3dwfgnqdfNz63qqICez/bjzOS7LyzcuVKDBw4UKOLNWjef7bTEiR9TTxXu7SSCY6w6oiibZlti5V3Vit07HCmcm+S69f3/IzP3f/5gaQ/b9euXcZtUvZhwKojXvsgs0fCQf3Og/IXPSl17pR5ukRpSfLF0Gee6SbYkhsMWHVEwcZPMzrv7G4dlHuSWtMmTTI+91DJ0aQ/byJok7KPeA7LZqnfbCtDLCkba7Mvqa7xL5VVVcBpmf3b5HIyu0mTRkAVqlU/vXXwORg44MJqxx0rq8BNM56t9rPDR5JvXx+P6/2brD1nqnkt6f2lOceVeK7mPcRqDXVADEDGOQ0OVVRU1CjVPODi83H9iOoLuT8/cBhICFjaCYqUnfhIWIuUlSXfnisWiwHxnIzaPHwk+aOWDQcOHKrxs0YNT6/xs2NHa/apZfPkj36VXLZTqzgfYZkMXbWH3KbDZtupBkHHZ7LS//Dhw2jRokXS42+6vDuefmOLUZ8A4IN1W43PyVTzZk3w5rzJ2PrJDry/djNm/d+HaJOkEkOywFwvN3lAPnSoZhBMl+kUg2YJb+m9akozhUezEkQijrBqkeLi1LlWndq3zqjN3760DkdK3YyyGjQ4Hf0uvhDfHT0MM2dMwfH3nkQsFsfbq9Zg+45dKCs7sWPO3k/31Ti3TevkJWZ27dpltc/kFuewapHdu3enzHY/5+yOAN4xbrOssgrr1m9C329cIOyduXg8jqXL3sL0Z0/0u348hrFXnIeS0oTif1VAixbNkraxZ88e290khzjCqkU2bUq9CLhL58zTE55dvCLjc9O1dv0mPPib+Vj/0ccn551KSo5g+sIvg+zxyio8+tJ6LMj/uNq5157fLuWu0Bs3brTXaXLOesAyLZMRVvJFUm7GtPyHpDRJFNatW5fytc6CGlYz/74G6zZ8HH5ghioqKzF3/mJM/d1K9LphOkbecg9eWv4GXslfldYdes3lvVO+Nn78+Iw/F+3PVFKqRnqtsPYl5WRMy/BIcIRVi7z7bup6Vx3at8PgszObxwKA6TOfxtFj8jrsyeS/vgqPvrz+5P//dU0xrrpzHoZPnZ/W+b2/Jt+jkPzAgFWLFBQUpCzgF4sBo6/rn3Hbz6zehjnzFqJSOZ+raFsxbp72RFrHdmlSHz+/+dJqP4sB6Hnu2ap9ouzFgFWLVFZWIj8/P+Xrl15yYcrX0vHDx1fgj88sUQ1ai//3VWwvqZ6mcF7LBkmPvXfCNbj7h2Pw6au/wfPTv4u87i3x0xv7oVnTxmr9oewm3jVHuhxG8xk3ypIb0hwc074FLRNKpbKqCv8x5l4sXL0treNTmTluECaOHY3TT6svagcAysrK8avZC/Djp06UlenUuD7een4Giot3467/eRL5hV8AAHLiMexa/utq6QtlZeU4dLgELVN8Qzhp0iTMnj272s8k+Uo2S7zYzOlKpy8m54ZhHhapiMdiGHezcKcanBhp3Tzhvowm4ncU78Z7a9bj4y1FAE6USL7rjlvw81suAwAs/M1t6HBmW/T9xgVY8ocZmDl2EADg6R+PqpFrVa9ebspgBQCLFi0y7h9lN46wMuyLjyMsADh27Diu/fdpWLG5ZvJlJu4c1hs3/Nsg9Or5VTRsUHMZDQCUHj2GDRs3Y8nSfPzsz2+f/PkjP7gaE8eORiwGlFdU4IMPN6LPhT1rnF/w/nqc26M7GiZZppPK8uXLccUVV6guOucIKz02/+YZsDLsi68BCzixl9/lEx8xOidMbjyGiUN64vzzuqFp4xNzUMeOl2PNui14fOmHOFyefE3fslnjMXhgv8C2X3ntbbzz7nrc+v1RaNG8aVr9GTVqFBYtWsSAlWZfTM4Nk9UBq0aDFt9IzYCTDptrv6SlciTKKyow6a5f4rfLP1JrM1Mt6ufgvb/chy6dkie2FhYV4+JR92Lv0XL0bd8Ev/7pf6L/N9Mv2WwSJBJp/yNkcr7rXD7N+83mvcs5rDooNycHUyffhEY50X/8nx+vwE/um4uSJPWs9u3/ArdNnYW9R0+sIVy18xAGjJuFJUtXuu4mZYno71iKROdO7fHMA7dE3Q0AwJ/eKcLj82tOkL+84k28sKH6WsChvdph4GV9XXWNsgwDVh129RWX4f5bvhV1NwAAd85djpWvr6r2s+tHXIXZtw05+f9dmtTHIw9MQuNGdrcco+ylvlW9ZH1esmdfSVuma6LCjjdZHyVdy2VyftBrK1akXrgcj8cwacKNuHXwuaG/jws3/mgutu/4cnefnJwcTBwzGnMmXQMAeO7hO9A5xVxXuoLeY9P7yXTNXND5pueavm6Ty745/5ZQMslu2hfT9kzOd/2tTlB7Qe9p9+7dsXnz5sC2Dh46jCl3P4Tf5Qcf58JN/bvhsYemocHpp538WWVlJT7eUoQeZ3c1bk9yf9n8Zjfxde2/I+nfjuQb8zBMHKWUtmwJrzLatEljPHT/lKwYaT395lY8+dTz1X4Wj8czClZU+zBgEYATQWvmjMlZMad1+6Mv4Y1/FETdDcpC6nlYNS4gHFabnGvK9mOdSdum19LMJzpVZWUVli7Lxw3TFqCkIroNHLo3PQ35i6ajfbu2gccVFBTg0ksvRWnpibQIyWOYKZvTH9r5jC4TaG3mS3KERdXE4zFcO+RbWP/3GZgQ4SPiloPHcM/0uTgWUIOrsLAQw4cPPxmsqPZjwKKkOndsj4d/eRdWzvkBBp3VKpI+zM/fjAV/WJz0teLiYuTl5WHnzp2Oe0VR4iOhQXt14ZEwmWPHjuMfq9bgsQVL8IywNE2iVvVzMOhrHfBsQLtvPTEFl/T9sgxyYWEh8vLy8Mknn9Q4lo+E8r7YvlZWrSWMkvZXu4myKa3BhNYNU1lVhc1bivDGP97Hn//2BpZv+iyjduIx4O6RfZF3WR/07XMBGjVqiK2F27EyfxV+Mmcp9pRWL+jXq3UDLF84A2e0bYWCggIMHz785MhKsibTdqA3YTslx7Q9CZtrCRmwAs5PVNcDVmIbO3ftReG2YhQWFeOfm3dg287P8FT+FuB4+YmodLwS3+zZFv3O74iundqha+cO6Nb1K+jcsT0aNkxeVfRI6VGsLliLhX9ZgcdOWZw9dmAPPPKru9C8WbNqc1YMWOmdb9qeBANWmhiw0ru27Y/8X+1LH7mKtu/Eq/mr8It5L2Lj/lLcPHwAnpoxLum1UmHAyqw9CQasNDFgpXdt3z7y0qPH8MRf8rHinQ342+zJ1V5jwErvfNP2JGzeb+Kdn7XXLUmWKySSvnGS5QmJ50onIiXLOsKcev7o0aNx//33o0uXLkZt2KL5PiW+HvaZSO8/yfKqoGMzof2Pt8m1mIdF1ixcuBA9evTAxIkTsW2b7jeCRFLqi5+lNEdYQW0nY/IvgfYQ3uYIK9P3MScnB9dddx3Gjx+PK6+8MrB/tkQ5wkrEEVZm18qqtAYGLPvXCjveVsA6Vbt27TBy5EgMHToUQ4YMCT1eCwNWetcKw4CVZmdsJtPZ/pDD+mOT5EPW/kw0f+/bb78d7777LlavXo2Kigrnn7Hoj8XilzouP4N0uExyNcGAZYABS0772gxYdmRrwOKkOxF5gwGLiLwhzsPSnuA1SexLZHsSPug1zcngdNozYZqvZvp6ENv5aBK2H2U073XtL6CC+iJl8/GVIywi8gYDFhF5w/nSHJPlENLHA+nSC002lxW5XENpen3X6/U0Hym17z+TY7Uf8VRzoZS/fTfBERYReYMBi4i8wYBFRN5wXg8ryudfzbVj2mkMEtKP0HYZFcm1bGa6R51NHiSb1qqasjlvyREWEXmDAYuIvMGARUTeUJ/DsrkExXW9oqDr25yTSqd9SV6Wdu5c2PFBou6r5NxsnhO1+Xdn++8sCEdYROQNBiwi8gYDFhF5w3rFUWl7QbTXS2lWR5VeK+x4rXM1aM7NhLUdRrOki8v7J4z2nJXNMk821zFyhEVE3mDAIiJvMGARkTecl0g2bc9mX6LcHcb0/ESSWku2r21z/sOU7Xy5IDbX50X5dxflnClHWETkDQYsIvIGAxYReUO9pnuUcwZR5oBJ245ym68wkrlB1/eDZh11089E0p7tOmA+bY8WhCMsIvIGAxYReYMBi4i84byme40ORLg+z/R8m+scfVpnZnJ9l7XE02Gzln6Udfxtfua2a3WZ4AiLiLzBgEVE3mDAIiJvqOdhhUl8fjWpTS4V9iytWUddyuW6Runci8nvLs0f0sxPkr4P2vltmm1J8/6CzmceFhFRGhiwiMgbDFhE5A3xHFYizfkP1/kfmrkq2nMIklwn02sncrkPne28rKD2otwTMZHtvf5M7jeX+w6G4QiLiLzBgEVE3lAvkazJ9lfgiSTDZO3UAMnjre0Sti63OTdtX3Kudllhl6V1bKcAaV6bS3OIqE5gwCIibzBgEZE31NMabJbQMGX6dazNeaIoq/hkU/qH7TktzVQUm0uUpOdGue1XlNvncYRFRN5gwCIibzBgEZE31OewpCRbHwW1law9ybyB6/LLkrkZ16V8JXMWpn3VnD+Jcj5Nu22X95fL+VqOsIjIGwxYROQNBiwi8ob6Nl9R5h/Zzjcy4XKLsqjLM7vMdYpyXihK0ntVs3yRdt6eCY6wiMgbDFhE5A0GLCLyhngOy/W26EG0n/NN2nKdl2VCc05K2r7tHC+fyjebzBOFsf0ZB13LZQlljrCIyBsMWETkDQYsIvKG9TmsKEmfrSXbnkvaStaeSX1522u9osx90ry/bH4m6bye6bHJjk+kOZdsO5fOBEdYROQNBiwi8gYDFhF5w/kclsnzrcvn9GTHJzJ5zg+jmYelPW/o0xq6RJLPWDunUHM7+ES29540uTbzsIiIkmDAIiJvMGARkTfU62G5ZDu/yOZbY3utmOa1bK7BNO1LWHuaOWi264xlU56fpG3mYRERJcGARUTeYMAiIm+I9yV0mbPjerpNkjejXatcMt/hOkdMsn+j7c9Y8j5qf4YmOWFhr0vnuEzaYx4WEVEaGLCIyBsMWETkDfEcViKX9Yq0n6U155G010GakObkSD9Dk/Nd1zI3Odd0Lk/ymYd9BtpzWmF9k1zL5rw2R1hE5A0GLCLyhvojYSKXSwZsl9xwOWzWfETUTmsIO96lsL66fFyJcqt76f0l4fL35AiLiLzBgEVE3mDAIiJvWJ/Dcsn2EgHJkpNsKs9syvU2YiZszhtpp1wEnW97yzHJ9bKpAhVHWETkDQYsIvIGAxYRecPrOawoc5tM83/CzpfMYUQ5hxR2PdO5O9tbawUxfR+l80iSbb60jw/6XbSX4rBEMhHVCQxYROQNBiwi8ob1Oawoczi0y4eYtB1Gs/yu9Pc07Ztkzsz1tl2aW9NLzzf5DG1vzZZIsxx4WNsSHGERkTcYsIjIGwxYROQN8Vb12bTNl/Zawmz63UxEWZ45neubXEv7d7G5HjSsb0Htab/nmmssXf/dBeEIi4i8wYBFRN5gwCIib4jnsIiIXOEIi4i8wYBFRN5gwCIibzBgEZE3GLCIyBsMWETkDQYsIvIGAxYReYMBi4i8wYBFRN5gwCIibzBgEZE3GLCIyBsMWETkjf8H8h9fw1RJ6TwAAAAASUVORK5CYII="
  // );
  // const [invoice, setInvoice] = useState<invoiceId>({ invoice_id: "" });
  const [invoice, setInvoice] = useState<string>("");
  // const [invoice, setInvoice] = useState<string>("87f3e263-8065-4c99-a2ad-d48622620b15");
  const router = useRouter();
  const createInvoice = async () => {
    if (qpayImage == "") {
      const qpay = await getQPayInvoice(total);
      const q = qpay.data.qr_image;
      const dataURL = `data:image/png;base64,${q}`;
      console.log(dataURL);
      setInvoice(qpay.data.invoice_id);
      setQpayImage(dataURL);
    }
  };

  const checkPaymentInvoice = async () => {
    if (!invoice) {
      console.error("Invoice ID is null");
      return;
    }
    setCheckingPayment(true);
    try {
      const qpay = await checkPayment(invoice);
      const paymentStatus = qpay.data.qpayResponse.status;
      if (paymentStatus == 200) {
        toast.success("Төлбөр амжилттай төлөгдлөө");
        clearCart();
        router.push("/");
      } else toast.error("Төлбөр хүлээгдэж байна");

      console.log(qpay);
    } catch (error) {
      console.log(error);
    }
    setCheckingPayment(false);
  };

  useEffect(() => {
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotal(totalPrice);
    const fetchUser = async () => {
      const user = await getDBUserID();
      setUserId(user);
    };
    fetchUser();
  }, [userId]);

  if (!userId) return <ShoppingCardSkeleton />;

  if (cart.length === 0) return <p>Сагс хоосон байна.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">🛒 Миний сагс</h2>
      {cart.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <img
              src={item.image}
              alt="item.title"
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-lg">{item.title}</h3>
            <p>Үнэ: {item.price} ₮</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
              className="border p-1 w-12 text-center"
            />
            <Button variant="outline" onClick={() => removeFromCart(item._id)}>
              ❌
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <Button className="mt-4" onClick={clearCart} variant={"destructive"}>
          Сагс хоослох
        </Button>
        <Button
          className="mt-4"
          onClick={() => {
            showPaymentMethod(true);
            createInvoice();
          }}
        >
          Төлбөр төлөх
        </Button>

        {paymentMethod && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="relative w-3/4  md:w-1/4">
              <Card>
                <CardHeader>
                  <div className="text-lg justify-center items-center  font-semibold">
                    Төлбөр төлөх
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col w-full items-center justify-center">
                    {!qpayImage ? (
                      <div>Loading</div>
                    ) : (
                      <img
                        src={decodeURIComponent(qpayImage)}
                        className="w-full"
                      />
                    )}
                    <Button
                      onClick={checkPaymentInvoice}
                      disabled={checkingPayment}
                      className="mt-2"
                    >
                      Төлбөр шалгах
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <button
                className="absolute top-4 right-2 bg-red-600 text-white px-4 py-2 rounded-full"
                onClick={() => {
                  showPaymentMethod(false);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
