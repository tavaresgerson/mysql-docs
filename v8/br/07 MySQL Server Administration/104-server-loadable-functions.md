## 7.7 Funções carregáveis do servidor MySQL

O MySQL suporta funções carregáveis, ou seja, funções que não são incorporadas, mas podem ser carregadas no tempo de execução (ou durante a inicialização ou posteriormente) para estender as capacidades do servidor, ou descarregadas para remover as capacidades.

::: info Note

As funções carregáveis eram anteriormente conhecidas como funções definidas pelo usuário (UDFs). Essa terminologia era um pouco equivocada porque definido pelo usuário também pode ser aplicado a outros tipos de funções, como funções armazenadas (um tipo de objeto armazenado escrito usando SQL) e funções nativas adicionadas modificando o código-fonte do servidor.

:::

As distribuições do MySQL incluem funções carregáveis que implementam, no todo ou em parte, as seguintes capacidades do servidor:

- A Replicação de Grupo permite criar um serviço MySQL distribuído altamente disponível em um grupo de instâncias de servidor MySQL, com consistência de dados, detecção e resolução de conflitos e serviços de associação a grupos todos embutidos.
- O MySQL Enterprise Edition inclui funções que executam operações de criptografia baseadas na biblioteca OpenSSL.
- O MySQL Enterprise Edition inclui funções que fornecem uma API de nível SQL para operações de mascaramento e desidentificação.
- O MySQL Enterprise Edition inclui o registro de auditoria para monitoramento e registro da atividade de conexão e consulta.
- O MySQL Enterprise Edition inclui uma capacidade de firewall que implementa um firewall de nível de aplicativo para permitir que os administradores de banco de dados permitam ou neguem a execução de instruções SQL com base em correspondências com padrões para instruções aceitas.
- Um reescritor de consulta examina as instruções recebidas pelo MySQL Server e possivelmente as reescreve antes que o servidor as execute.
- Os Tokens de versão permitem a criação e sincronização em torno de tokens de servidor que os aplicativos podem usar para evitar o acesso a dados incorretos ou desatualizados.
- O MySQL Keyring fornece armazenamento seguro para informações confidenciais.
- Um serviço de bloqueio fornece uma interface de bloqueio para uso de aplicações.
- Uma função fornece acesso a atributos de consulta.

As seções a seguir descrevem como instalar e desinstalar funções carregáveis e como determinar no tempo de execução quais funções carregáveis estão instaladas e obter informações sobre elas.

Em alguns casos, uma função carregável é carregada instalando o componente que implementa a função, em vez de carregá-la diretamente.

Para obter informações sobre como escrever funções carregáveis, consulte Adicionar Funções ao MySQL.
