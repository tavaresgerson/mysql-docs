### 17.9.5 Recuperação Distribuída

[17.9.5.1 Fundamentos da Recuperação Distribuída](group-replication-distributed-recovery-basics.html)

[17.9.5.2 Recuperando de um Ponto Específico no Tempo](group-replication-recovering-from-a-point-in-time.html)

[17.9.5.3 Alterações de View](group-replication-view-changes.html)

[17.9.5.4 Recomendações de Uso e Limitações da Recuperação Distribuída](group-replication-usage-advice-and-limitations-of-distributed-recovery.html)

Esta seção descreve o processo, chamado de *distributed recovery*, através do qual um *member* que está se juntando a um *group* se sincroniza com os demais *servers* no *group*. A *distributed recovery* pode ser resumida como o processo através do qual um *server* obtém as *transactions* faltantes do *group* para que ele possa então se juntar ao *group* após ter processado o mesmo conjunto de *transactions* que os outros *members* do *group*.