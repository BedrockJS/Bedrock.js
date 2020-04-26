enum Reliability {
    Unreliable = 0,
    UnreliableSequenced = 1,
    Reliable = 2,
    ReliableOrdered = 3,
    ReliableSequenced = 4,
    UnreliableACK = 5,
    ReliableACK = 6,
    ReliableOrderedACK = 7,
}

export default Reliability;
