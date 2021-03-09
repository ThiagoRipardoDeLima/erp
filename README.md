# ERP - Sistema de Acompanhamento e Lançamento de Despesas de Obras

Sistema responsável pela gestão de aquisição de insumos para obras de construção civil.

## Ambiente de Desenvolvimento

Essas instruções fornecerão uma cópia do projeto instalado e funcionando em sua máquina local para fins de desenvolvimento e teste. Consulte 'implantação' para obter notas sobre como implantar o projeto em um sistema ativo.

### Pré-requisitos

* [Visual Studio Code](https://code.visualstudio.com/download) - Ou outra GUI equivalente. Versão utilizada: 1.54.x
* [NodeJS](https://nodejs.org/en/download/) - NPM para minify/uglify de JS e CSS. Versões utilizadas: Node 14.16.x | NPM 6.14.x
* [Docker](https://www.docker.com/products/docker-desktop) - Para conteinerização do projetos. Versão utilizada: 20.10.x

Opcionalmente:

* [MariaDB](https://downloads.mariadb.org/mariadb/10.4.6/) - Banco de Dados Relacional
* [PHP](https://www.php.net/downloads.php) - PHP 7.X
* [NodeJS](https://nodejs.org/en/download/) - NPM para minify/uglify de JS e CSS. Versões utilizadas: Node 14.16.x | NPM 6.14.x
* [SQL Power Architect](http://www.bestofbi.com/page/architect_download_os) - Para visualização/exportação do modelo de banco de dados. Versão 1.08
* [GIT Client](https://git-scm.com/downloads) - Para clonagem do repositório. Versão utilizada: 2.29.x
* [DBeaver Community](https://dbeaver.io/download/) - Para execução de SQLs. Versão utilizada: 7.x.x


### Instalando

* Clone o repositório ou copie a pasta para máquina local (htdocs do Apache ou Xampp)
* Abra a pasta do projeto com Visual Studio Code
* Instale o pacote [cross-env](https://www.npmjs.com/package/cross-env) como global: *npm install -g --save-dev cross-env*
* Instale os demais pacotes localmente: *npm install*
* Teste o minify/uglify e os pacotes de desenvolvimento: *npm run prod*
* Faça uma cópia do arquivo ./application/control/conexao/config.example.php, renomeie para config.php e adeque conforme seu ambiente, para validação e conexão de usuários à App:
    * APP_ENVIRONMENT: DEV ou PROD, para desenvolvimento ou produção
    * APP_VERSION: Versão da aplicação
    * APP_BASE_URL: Define a URL base da aplicação
    * DB_DRIVER: Driver PDO que será utilizado pelo PHP. Padrão: mysql
    * DB_HOSTNAME: IP/Nome do servidor de banco de dados
    * DB_USERNAME: Usuário do banco de dados. Necessita permissões para execução de procesimentos
    * DB_PASSWORD: Senha do usuário do banco de dados
    * DB_DATABASE: Schema do banco de dados que será utilizado
    * DB_PORT: Porta de conexão com banco de dados
    * DB_CHARSET: Charset do banco de dados
 
* Abra o arquivo de configurações do PHP (PHP.ini):
    * Aumente o tempo padrão de timeout: *max_execution_time*
    * Aumente o limite padrão de memória por scripts: *memory_limit*

* Exporte o modelo de banco de dados para SQL através do *SQL Power Architect*
    * Ignore as advertências ao gerar SQL (restrições da ferramenta, para auto-referência, sequences, etc)
    * Crie um banco de dados vazio com o nome que desejar: Nome recomendado *erp*; Charset *utf8mb4*; Collation *utf8mb4_general_ci*
    * Execute o SQL gerado no banco de dados criado

### Instalando (Docker)
* Clone o repositório ou copie a pasta para máquina local
* Acesse o terminal do seu SO host ou do Visual Studio Code
* Através do terminal, acesse a pasta do projeto em sua máquina
    * A pasta raiz deve conter o arquivo *docker-compose.yml*
* Ainda no terminal, execute o comandos:
    * *docker-compose up -d*, para inicializar os containers:
        * dberp (Mariadb 10.4.17)
        * nginx (NGinx 1.19.6)
        * php7 (PHP-FPM 7.3)
    * *docker-compose ps*, para listar os containers e seu status atual    
* A aplicação já se encontra disponível através da URL http://localhost
