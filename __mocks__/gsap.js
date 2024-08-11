const gsap = {
    to: jest.fn(),
    from: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn(),
      from: jest.fn(),
    })),
  };
  
  export default gsap;
  