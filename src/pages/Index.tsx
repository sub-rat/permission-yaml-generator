
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Card className="max-w-lg w-full p-6 text-center shadow-md">
        <CardContent>
          <h1 className="text-4xl font-bold mb-4">Welcome to Permission Manager</h1>
          <p className="text-gray-700 mb-6">
            Manage users, roles, and permissions with ease.
          </p>
          <Button asChild>
            <Link to="/permissions">Go to Permission Editor</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
