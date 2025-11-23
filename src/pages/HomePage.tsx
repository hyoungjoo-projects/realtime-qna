import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useRealtimeQuestions } from "@/hooks/useRealtimeQuestions";
import { useRealtimeVotes } from "@/hooks/useRealtimeVotes";
import { CreateQuestionForm } from "@/components/questions/CreateQuestionForm";
import { QuestionList } from "@/components/questions/QuestionList";
import { LogOut, User, MessageSquare, ThumbsUp, Clock } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";

export function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Realtime 구독 활성화
  useRealtimeQuestions();
  useRealtimeVotes();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      showError("로그아웃에 실패했습니다. 다시 시도해주세요.");
    } else {
      showSuccess("로그아웃되었습니다.");
      navigate("/login");
    }
  };

  const faqItems = [
    {
      question: "실시간 Q&A는 어떻게 작동하나요?",
      answer: "질문을 작성하면 즉시 커뮤니티에 공유되며, 다른 사용자들이 실시간으로 답변하고 투표할 수 있습니다.",
    },
    {
      question: "질문에 제한이 있나요?",
      answer: "하루에 제한 없이 질문할 수 있으며, 모든 질문은 커뮤니티 가이드라인을 준수해야 합니다.",
    },
    {
      question: "답변은 어떻게 정렬되나요?",
      answer: "답변은 투표 수에 따라 자동으로 정렬되며, 가장 유용한 답변이 상단에 표시됩니다.",
    },
    {
      question: "알림을 받을 수 있나요?",
      answer: "네, 내 질문에 새로운 답변이 달리거나 투표가 발생하면 실시간 알림을 받을 수 있습니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1220 810"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            className="opacity-40"
          >
            <g>
              {[...Array(30)].map((_, i) => (
                <React.Fragment key={`row-${i}`}>
                  {[...Array(20)].map((_, j) => (
                    <rect
                      key={`${i}-${j}`}
                      x={i * 40}
                      y={j * 40}
                      width="39"
                      height="39"
                      stroke="hsl(var(--foreground))"
                      strokeOpacity="0.05"
                      strokeWidth="0.5"
                      className="transition-all duration-300"
                    />
                  ))}
                </React.Fragment>
              ))}
            </g>
          </svg>
        </div>

        <motion.div
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                실시간 Q&A
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm"
                aria-label={`로그인된 사용자: ${user?.email}`}
              >
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {user?.email}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                aria-label="로그아웃"
                className="gap-2 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              실시간 커뮤니티 Q&A
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {"커뮤니티와 함께".split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3 + index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="inline-block mr-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {"질문하고 답변하세요".split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.6 + index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="inline-block mr-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              실시간으로 질문을 공유하고, 커뮤니티의 지혜를 모아 최고의 답변을 찾아보세요.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>실시간 업데이트</span>
              </div>
              <div className="w-px h-6 bg-border" aria-hidden="true"></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                <span>투표 시스템</span>
              </div>
              <div className="w-px h-6 bg-border" aria-hidden="true"></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                <span>무제한 질문</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CreateQuestionForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 sm:p-8 backdrop-blur-sm bg-card/50 border-border shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <ThumbsUp className="h-6 w-6 text-primary" aria-hidden="true" />
                  질문 목록
                </h2>
                <div className="space-y-4">
                  <QuestionList />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">자주 묻는 질문</h2>
            <p className="text-lg text-muted-foreground">
              궁금한 점이 있으신가요? 여기서 답을 찾아보세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-card/50 border-border shadow-lg overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border">
                    <AccordionTrigger className="px-6 py-4 hover:bg-accent/50 transition-colors">
                      <span className="text-left font-medium">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 실시간 Q&A. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

