"use client";

const banks = [
  {
    name: "State Bank of India",
    type: "Public Sector Bank",
  },
  {
    name: "Bank of Maharashtra",
    type: "Public Sector Bank",
  },
  {
    name: "Central Bank of India",
    type: "Public Sector Bank",
  },
  {
    name: "Punjab National Bank",
    type: "Public Sector Bank",
  },
];

export default function BankList() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        Potential Financing Partners
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {banks.map((bank) => (
          <div
            key={bank.name}
            className="rounded-xl border p-4"
          >
            <p className="font-medium">
              {bank.name}
            </p>

            <p className="text-xs text-gray-500">
              {bank.type}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Bank availability and scheme eligibility
        should be verified with the relevant branch
        or government authority.
      </p>
    </div>
  );
}